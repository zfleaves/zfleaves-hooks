import { useCallback, useEffect, useRef } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import { isNumber } from '../utils';

/**
 * 一个用于设置和清除定时器的 Hook。
 * @param fn 要执行的函数。
 * @param delay 定时器的延迟时间，单位为毫秒。
 * @param options 配置选项。
 * @param options.immediate 是否立即执行一次函数。
 * @returns 一个函数，用于清除定时器。
 */
const useInterval = (fn: () => void, delay?: number, options: { immediate?: boolean } = {}) => {
    const timerCallback = useMemoizedFn(fn);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clear = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, []);

    useEffect(() => {
        if (!isNumber(delay) || delay < 0) {
            return;
        }
        if (options.immediate) {
            timerCallback();
        }
        timerRef.current = setInterval(timerCallback, delay);
        return clear;
    }, [delay, options.immediate])

    return clear;
}

export default useInterval;