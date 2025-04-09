import type { DependencyList } from 'react';
import { useEffect } from 'react';
import { isFunction } from '../utils';

// 判断一个值是否是异步生成器
function isAsyncGenerator(
    val: AsyncGenerator<void, void, void> | Promise<void>,
): val is AsyncGenerator<void, void, void> {
    // Symbol.asyncIterator 是 JavaScript 中异步生成器的标识符
    return val && isFunction(val[Symbol.asyncIterator]);
}

/**
 * 异步 useEffect
 * @param effect 异步函数
 * @param deps 依赖数组
 */
function useAsyncEffect(
    effect: () => AsyncGenerator<void, void, void> | Promise<void>,
    deps?: DependencyList,
) {
    useEffect(() => {
        // 执行传入的异步函数，获取返回值
        const e = effect();
        // 用于标记组件是否已卸载
        let cancelled = false;
        
        // 定义异步执行函数
        async function execute() {
            // 判断返回值是否是异步生成器
            if (isAsyncGenerator(e)) {
                // 循环处理异步生成器
                while (true) {
                    // 等待下一个值
                    const result = await e.next();
                    // 如果生成器已完成或组件已卸载，则退出循环
                    if (result.done || cancelled) {
                        break;
                    }
                }
            } else {
                // 如果是 Promise，直接等待其完成
                await e;
            }
        }
        
        // 执行异步操作
        execute();
        
        // 返回清理函数，在组件卸载时调用
        return () => {
            // 标记组件已卸载
            cancelled = true;
        };
    }, deps); // 依赖数组变化时重新执行
}

export default useAsyncEffect;