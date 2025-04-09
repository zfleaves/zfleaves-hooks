import { useRef } from 'react';
import type { Plugin, Timeout } from '../types';
import useLatest from '../../../useLatest';

/**
 * 重试插件 - 用于在请求失败时自动重试
 * @template TData - 响应数据的类型
 * @template TParams - 请求参数的类型
 */
const useRetryPlugin: Plugin<any, any[]> = (fetchInstance, { retryInterval, retryCount, maxRetryCallback }) => {
    // 存储定时器引用
    const timerRef = useRef<Timeout>();
    // 存储重试次数
    const countRef = useRef(0);
    // 标记是否由重试触发
    const triggerByRetry = useRef(false);
    
    const maxRetryCallbackRef = useLatest(maxRetryCallback);

    // 如果没有设置重试次数，返回空对象
    if (!retryCount) {
        return {};
    }

    return {
        /**
         * 请求前的处理
         * 重置重试状态
         */
        onBefore: () => {
            // 如果不是由重试触发的，重置计数
            if (!triggerByRetry.current) {
                countRef.current = 0;
            }
            // 重置触发标记
            triggerByRetry.current = false;

            // 清除之前的定时器
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        },

        /**
         * 请求成功的处理
         * 重置重试计数
         */
        onSuccess: () => {
            countRef.current = 0;
        },

        /**
         * 请求失败的处理
         * 执行重试逻辑
         */
        onError: () => {
            // 增加重试计数
            countRef.current += 1;
            
            // 如果设置了无限重试或未超过最大重试次数
            if (retryCount === -1 || countRef.current <= retryCount) {
                // 指数退避算法计算等待时间
                const timeout = retryInterval ?? Math.min(1000 * 2 ** countRef.current, 30000);
                
                // 设置定时器，延迟重试
                timerRef.current = setTimeout(() => {
                    // 标记为由重试触发
                    triggerByRetry.current = true;
                    // 刷新请求
                    fetchInstance.refresh();
                }, timeout);
            } else {
                // 超过最大重试次数，重置计数
                countRef.current = 0;
                maxRetryCallbackRef.current?.();
            }
        },

        /**
         * 请求取消的处理
         * 清理重试状态
         */
        onCancel: () => {
            // 重置重试计数
            countRef.current = 0;
            // 清除定时器
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        },
    };
}

export default useRetryPlugin;