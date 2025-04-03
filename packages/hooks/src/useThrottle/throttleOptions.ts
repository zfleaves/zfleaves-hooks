export interface ThrottleOptions {
    wait?: number;
    leading?: boolean; // 是否在节流开始时立即执行函数。
    trailing?: boolean; // 是否在节流结束时执行函数
}