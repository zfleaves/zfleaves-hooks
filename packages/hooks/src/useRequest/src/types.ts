import type { DependencyList } from 'react';
import type Fetch from './Fetch';
import type { CachedData } from './utils/cache';

export type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;
export type Subscribe = () => void;

export interface FetchState<TData, TParams extends any[]> {
    loading: boolean;
    params?: TParams;
    data?: TData;
    error?: Error;
}

export interface PluginReturn<TData, TParams extends any[]> {
    onBefore?: (params: TParams) =>
        | ({ stopNow?: boolean; returnNow?: boolean; } & Partial<FetchState<TData, TParams>>)
        | void;

    onRequest?: (
        service: Service<TData, TParams>,
        params: TParams,
    ) => {
        servicePromise?: Promise<TData>;
    };

    onSuccess?: (data: TData, params: TParams) => void;
    onError?: (e: Error, params: TParams) => void;
    onFinally?: (params: TParams, data?: TData, e?: Error) => void;
    onCancel?: () => void;
    onMutate?: (data: TData) => void;
}

export interface Options<TData, TParams extends any[]> {
    manual?: boolean;           // 是否手动触发
    defaultParams?: TParams;    // 默认参数

    // 各种回调函数
    onBefore?: (params) => void;
    onSuccess?: (data, params) => void;
    onError?: (e, params) => void;
    onFinally?: (params, data?, e?) => void;

    // 自动刷新相关
    refreshDeps?: DependencyList;
    refreshDepsAction?: () => void;

    // 加载延迟
    loadingDelay?: number;

    // 轮询相关
    pollingInterval?: number;
    pollingWhenHidden?: boolean;
    pollingErrorRetryCount?: number;

    // 窗口聚焦刷新
    refreshOnWindowFocus?: boolean;
    focusTimespan?: number;

    // 防抖相关
    debounceWait?: number;
    debounceLeading?: boolean;
    debounceTrailing?: boolean;
    debounceMaxWait?: number;

    // 节流相关
    throttleWait?: number;
    throttleLeading?: boolean;
    throttleTrailing?: boolean;

    // 缓存相关
    cacheKey?: string;
    cacheTime?: number;
    staleTime?: number;
    setCache?: (data) => void;
    getCache?: (params) => CachedData | undefined;

    // 重试相关
    retryCount?: number;
    retryInterval?: number;
    maxRetryCallback?: () => void;

    // 就绪状态
    ready?: boolean;
}

export type Plugin<TData, TParams extends any[]> = {
    (fetchInstance: Fetch<TData, TParams>, options: Options<TData, TParams>): PluginReturn<TData, TParams>;
    onInit?: (options: Options<TData, TParams>) => Partial<FetchState<TData, TParams>>;
};

export interface Result<TData, TParams extends any[]> {
    loading: boolean;
    data?: TData;
    error?: Error;
    params: TParams | [];
    cancel: Fetch<TData, TParams>['cancel'];
    refresh: Fetch<TData, TParams>['refresh'];
    refreshAsync: Fetch<TData, TParams>['refreshAsync'];
    run: Fetch<TData, TParams>['run'];
    runAsync: Fetch<TData, TParams>['runAsync'];
    mutate: Fetch<TData, TParams>['mutate']; // 数据修改方法
}

export type Timeout = ReturnType<typeof setTimeout>;