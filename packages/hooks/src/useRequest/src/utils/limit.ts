/**
 * 限制函数执行频率
 * @param fn 需要限制的函数
 * @param timespan 限制的时间间隔
 * @returns 限制后的函数
 */
export default function limit(fn: any, timespan: number) {
    let pending = false;
    return (...args: any) => {
        if (pending) return;
        pending = true;
        fn(...args);
        setTimeout(() => {
            pending = false;
        }, timespan);
    }
}