import { useRef } from 'react';
import useCreation from '../../../useCreation';
import useUnmount from '../../../useUnmount';
import type { Plugin } from '../types';
import { setCache, getCache } from '../utils/cache';
import type { CachedData } from '../utils/cache';
import { setCachePromise, getCachePromise } from '../utils/cachePromise';
import { trigger, subscribe } from '../utils/cacheSubscribe';

/**
 * 缓存插件 - 用于管理请求数据的缓存
 * @template TData - 响应数据的类型
 * @template TParams - 请求参数的类型
 */
const useCachePlugin: Plugin<any, any[]> = (
    fetchInstance,
    {
        cacheKey,           // 缓存键
        cacheTime = 5 * 60 * 1000,  // 缓存时间，默认5分钟
        staleTime = 0,      // 数据过期时间，0表示永不过期
        setCache: customSetCache,    // 自定义设置缓存方法
        getCache: customGetCache,    // 自定义获取缓存方法
    }
) => {
    // 用于存储取消订阅的函数
    const unSubscribeRef = useRef<() => void>();
    // 用于存储当前请求的Promise
    const currentPromiseRef = useRef<Promise<any>>();

    /**
     * 设置缓存数据
     * @param key - 缓存键
     * @param cachedData - 要缓存的数据
     */
    const _setCache = (key: string, cachedData: CachedData) => {
        if (customSetCache) {
            customSetCache(cachedData);
        } else {
            setCache(key, cacheTime, cachedData);
        }
        // 触发缓存更新事件
        trigger(key, cachedData.data);
    }

    /**
     * 获取缓存数据
     * @param key - 缓存键
     * @param params - 请求参数
     */
    const _getCache = (key: string, params: any[] = []) => {
        if (customGetCache) {
            return customGetCache(params);
        }
        return getCache(key);
    };

    // 初始化时从缓存获取数据
    useCreation(() => {
        if (!cacheKey) {
            return;
        }

        // 从缓存获取数据
        const cacheData = _getCache(cacheKey);
        if (cacheData && Object.hasOwnProperty.call(cacheData, 'data')) {
            // 设置状态数据
            fetchInstance.state.data = cacheData.data;
            fetchInstance.state.params = cacheData.params;
            // 检查数据是否新鲜
            if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
                fetchInstance.state.loading = false;
            }
        }

        // 订阅相同缓存键的更新
        unSubscribeRef.current = subscribe(cacheKey, (data) => {
            fetchInstance.setState({ data });
        });
    }, []);

    // 组件卸载时取消订阅
    useUnmount(() => {
        unSubscribeRef.current?.();
    });

    // 如果没有缓存键，返回空对象
    if (!cacheKey) {
        return {};
    }

    return {
        /**
         * 请求前的处理
         * 检查缓存数据是否可用
         */
        onBefore: (params) => {
            const cacheData = _getCache(cacheKey, params);

            if (!cacheData || !Object.hasOwnProperty.call(cacheData, 'data')) {
                return {};
            }

            // 如果数据新鲜，停止请求
            if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
                return {
                    loading: false,
                    data: cacheData?.data,
                    error: undefined,
                    returnNow: true,
                };
            } else {
                // 如果数据过期，返回数据但继续请求
                return {
                    data: cacheData?.data,
                    error: undefined,
                };
            }
        },

        /**
         * 请求处理
         * 处理请求Promise的缓存
         */
        onRequest: (service, args) => {
            let servicePromise = getCachePromise(cacheKey);

            // 如果有缓存的Promise且不是自己触发的，使用缓存的Promise
            if (servicePromise && servicePromise !== currentPromiseRef.current) {
                return { servicePromise };
            }

            // 创建新的Promise并缓存
            servicePromise = service(...args);
            currentPromiseRef.current = servicePromise;
            setCachePromise(cacheKey, servicePromise);
            return { servicePromise };
        },

        /**
         * 请求成功的处理
         * 更新缓存数据
         */
        onSuccess: (data, params) => {
            if (cacheKey) {
                // 取消订阅，避免触发自己
                unSubscribeRef.current?.();
                // 设置新的缓存数据
                _setCache(cacheKey, {
                    data,
                    params,
                    time: new Date().getTime(),
                });
                // 重新订阅
                unSubscribeRef.current = subscribe(cacheKey, (d) => {
                    fetchInstance.setState({ data: d });
                });
            }
        },

        /**
         * 数据修改的处理
         * 更新缓存数据
         */
        onMutate: (data) => {
            if (cacheKey) {
                // 取消订阅，避免触发自己
                unSubscribeRef.current?.();
                // 设置新的缓存数据
                _setCache(cacheKey, {
                    data,
                    params: fetchInstance.state.params,
                    time: new Date().getTime(),
                });
                // 重新订阅
                unSubscribeRef.current = subscribe(cacheKey, (d) => {
                    fetchInstance.setState({ data: d });
                });
            }
        },
    };
}

export default useCachePlugin;