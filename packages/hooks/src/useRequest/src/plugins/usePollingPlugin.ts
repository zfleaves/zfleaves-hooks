import { useRef } from 'react';
import useUpdateEffect from '../../../useUpdateEffect';
import type { Plugin, Timeout } from '../types';
import isDocumentVisible from '../utils/isDocumentVisible';
import subscribeReVisible from '../utils/subscribeReVisible';

/**
 * 轮询插件 - 用于定期刷新数据
 * @template TData - 响应数据的类型
 * @template TParams - 请求参数的类型
 */
const usePollingPlugin: Plugin<any, any[]> = (
    fetchInstance,
    {
        pollingInterval,           // 轮询间隔时间
        pollingWhenHidden = true,  // 页面隐藏时是否继续轮询
        pollingErrorRetryCount = -1 // 错误重试次数，-1表示无限重试
    },
) => {
    // 存储定时器引用
    const timerRef = useRef<Timeout>();
    // 存储取消订阅函数引用
    const unsubscribeRef = useRef<() => void>();
    // 存储错误计数
    const countRef = useRef<number>(0);

    /**
     * 停止轮询
     * 清理定时器和取消订阅
     */
    const stopPolling = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        unsubscribeRef.current?.();
    };

    // 监听轮询间隔变化
    useUpdateEffect(() => {
        if (!pollingInterval) {
            stopPolling();
        }
    }, [pollingInterval]);

    // 如果没有设置轮询间隔，返回空对象
    if (!pollingInterval) {
        return {};
    }

    return {
        /**
         * 请求前的处理
         * 停止当前轮询
         */
        onBefore: () => {
            stopPolling();
        },

        /**
         * 错误处理
         * 增加错误计数
         */
        onError: () => {
            countRef.current += 1;
        },

        /**
         * 成功处理
         * 重置错误计数
         */
        onSuccess: () => {
            countRef.current = 0;
        },

        /**
         * 请求结束的处理
         * 设置下一次轮询
         */
        onFinally: () => {
            if (
                pollingErrorRetryCount === -1 ||
                // 当发生错误时，在达到重试次数后不再重复请求
                (pollingErrorRetryCount !== -1 && countRef.current <= pollingErrorRetryCount)
            ) {
                // 设置下一次轮询
                timerRef.current = setTimeout(() => {
                    // 如果页面隐藏且不允许隐藏时轮询，则订阅重新可见事件
                    if (!pollingWhenHidden && !isDocumentVisible()) {
                        unsubscribeRef.current = subscribeReVisible(() => {
                            fetchInstance.refresh();
                        });
                    } else {
                        // 否则直接刷新
                        fetchInstance.refresh();
                    }
                }, pollingInterval);
            } else {
                // 重置错误计数
                countRef.current = 0;
            }
        },

        /**
         * 取消请求的处理
         * 停止轮询
         */
        onCancel: () => {
            stopPolling();
        },
    };
};

export default usePollingPlugin;
