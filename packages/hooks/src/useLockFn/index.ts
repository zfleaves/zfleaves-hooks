import { useRef, useCallback } from 'react';

/**
 * 用于处理异步函数的 Hook。
 * @param fn 要处理的异步函数。
 * @returns 返回一个新的异步函数，该函数在执行时会锁定，防止重复执行。
 */ 
function useLockFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>) {
    const lockRef = useRef(false);

    return useCallback(
        async (...args: P) => {
            if (lockRef.current) return;
            lockRef.current = true;
            try {
                const ret = await fn(...args);
                return ret;
            } catch (e) {
                throw e;
            } finally {
                lockRef.current = false;
            }
        },
        [fn],
    );
}

export default useLockFn;