import { isFunction } from '../../utils';
import type { MutableRefObject } from 'react';
import type { FetchState, Options, PluginReturn, Service, Subscribe } from './types';

/**
 * Fetch 类 - 用于管理异步请求的核心类
 * @template TData - 响应数据的类型
 * @template TParams - 请求参数的类型（必须是数组类型）
 */
class Fetch<TData, TParams extends any[]> {
    // 存储所有插件的实现
    pluginImpls: PluginReturn<TData, TParams>[];

    // 请求计数器，用于跟踪请求的取消
    count: number = 0;

    // 请求状态对象
    state: FetchState<TData, TParams> = {
        loading: false,    // 是否正在加载
        params: undefined, // 当前请求的参数
        data: undefined,   // 响应数据
        error: undefined,  // 错误信息
    };

    /**
     * 构造函数
     * @param serviceRef - 服务函数的引用（使用 MutableRefObject 包装）
     * @param options - 配置选项
     * @param subscribe - 状态更新时的订阅函数
     * @param initState - 初始状态
     */
    constructor(
        public serviceRef: MutableRefObject<Service<TData, TParams>>,
        public options: Options<TData, TParams>,
        public subscribe: Subscribe,
        public initState: Partial<FetchState<TData, TParams>> = {},
    ) {
        // 初始化状态，如果非手动模式则自动开始加载
        this.state = {
            ...this.state,
            loading: !options.manual,
            ...initState,
        }
    }

    /**
     * 更新状态并通知订阅者
     * @param s - 要更新的状态部分
     */
    setState(s: Partial<FetchState<TData, TParams>> = {}) {
        this.state = {
            ...this.state,
            ...s,
        };
        this.subscribe(); // 通知订阅者状态已更新
    }

    /**
     * 执行插件处理函数
     * @param event - 插件事件名称
     * @param rest - 传递给插件函数的参数
     * @returns 插件处理结果的合并对象
     */
    runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
        // @ts-ignore
        const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean);
        return Object.assign({}, ...r);
    }

    /**
     * 异步执行请求
     * @param params - 请求参数
     * @returns Promise<TData> - 请求结果
     */
    async runAsync(...params: TParams): Promise<TData> {
        this.count += 1; // 增加请求计数
        const currentCount = this.count;

        // 执行前置插件
        const {
            stopNow = false,    // 是否立即停止请求
            returnNow = false,  // 是否立即返回数据
            ...state            // 其他状态更新
        } = this.runPluginHandler('onBefore', params);

        // 如果需要停止请求，返回一个永不解决的 Promise
        if (stopNow) {
            return new Promise(() => { });
        }

        // 更新状态为加载中
        this.setState({
            loading: true,
            params,
            ...state,
        });

        // 如果需要立即返回数据
        if (returnNow) {
            return Promise.resolve(state.data);
        }

        // 执行前置回调
        this.options.onBefore?.(params);

        try {
            // 获取服务 Promise（可能被插件替换）
            let { servicePromise } = this.runPluginHandler('onRequest', this.serviceRef.current, params);

            if (!servicePromise) {
                servicePromise = this.serviceRef.current(...params);
            }

            // 等待请求完成
            const res = await servicePromise;

            // 检查请求是否被取消
            if (currentCount !== this.count) {
                return new Promise(() => { });
            }

            // 更新成功状态
            this.setState({
                data: res,
                error: undefined,
                loading: false,
            });

            // 执行成功回调
            this.options.onSuccess?.(res, params);
            this.runPluginHandler('onSuccess', res, params);
            this.options.onFinally?.(params, res, undefined);
            this.runPluginHandler('onFinally', params, res, undefined);

            return res;
        } catch (error) {
            // 检查请求是否被取消
            if (currentCount !== this.count) {
                return new Promise(() => { });
            }

            // 更新错误状态
            this.setState({
                error,
                loading: false,
            });

            // 执行错误回调
            this.options.onError?.(error, params);
            this.runPluginHandler('onError', error, params);
            this.options.onFinally?.(params, undefined, error);
            this.runPluginHandler('onFinally', params, undefined, error);

            throw error;
        }
    }

    /**
     * 同步执行请求（忽略错误）
     * @param params - 请求参数
     */
    run(...params: TParams) {
        this.runAsync(...params).catch((error) => {
            if (!this.options.onError) {
                console.error(error);
            }
        });
    }

    /**
     * 取消当前请求
     */
    cancel() {
        this.count += 1; // 增加计数以取消当前请求
        this.setState({
            loading: false,
        });

        this.runPluginHandler('onCancel');
    }

    /**
     * 使用上次的参数刷新请求
     */
    refresh() {
        // @ts-ignore
        this.run(...(this.state.params || []));
    }

    /**
     * 异步刷新请求
     * @returns Promise<TData> - 请求结果
     */
    refreshAsync() {
        // @ts-ignore
        return this.runAsync(...(this.state.params || []));
    }

    /**
     * 修改数据
     * @param data - 新数据或数据修改函数
     */
    mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
        const targetData = isFunction(data) ? data(this.state.data) : data;
        this.runPluginHandler('onMutate', targetData);
        this.setState({
            data: targetData,
        });
    }
}

export default Fetch;