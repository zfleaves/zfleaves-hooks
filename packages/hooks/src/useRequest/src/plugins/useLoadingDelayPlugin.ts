import { useRef } from 'react';
import type { Plugin, Timeout } from '../types';

/**
 * 加载延迟插件 - 用于控制加载状态的显示时机
 * @template TData - 响应数据的类型
 * @template TParams - 请求参数的类型
 */
const useLoadingDelayPlugin: Plugin<any, any[]> = (
    fetchInstance,
    {
        loadingDelay,  // 加载延迟时间
        ready         // 是否准备就绪
    }
) => {
    // 用于存储定时器的引用
    const timerRef = useRef<Timeout>();

    // 如果没有设置延迟时间，返回空对象
    if (!loadingDelay) {
        return {};
    }

    /**
     * 取消定时器
     */
    const cancelTimeout = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    return {
        /**
         * 请求前的处理
         * 延迟设置加载状态
         */
        onBefore: () => {
            // 取消之前的定时器
            cancelTimeout();

            // 两种情况会设置加载状态：
            // 1. ready 未定义
            // 2. ready 为 true
            if (ready !== false) {
                // 设置定时器，延迟显示加载状态
                timerRef.current = setTimeout(() => {
                    fetchInstance.setState({
                        loading: true,
                    });
                }, loadingDelay);
            }

            // 初始状态设置为非加载
            return {
                loading: false,
            };
        },

        /**
         * 请求结束的处理
         * 清理定时器
         */
        onFinally: () => {
            cancelTimeout();
        },

        /**
         * 请求取消的处理
         * 清理定时器
         */
        onCancel: () => {
            cancelTimeout();
        },
    }
}

export default useLoadingDelayPlugin;