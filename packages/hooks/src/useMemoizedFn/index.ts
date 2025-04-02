import { useMemo, useRef } from 'react';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
) => ReturnType<T>;

// useMemoizedFn 的核心原理是通过 useRef 和 useMemo 缓存函数引用，
// 确保在组件重新渲染时，函数的引用保持不变。这种机制可以显著优化性能，特别是在需要稳定函数引用的场景中。
function useMemoizedFn<T extends noop>(fn: T) {
   if (isDev) {
     if (!isFunction(fn)) {
        console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`);
     }
   }

   const fnRef = useRef<T>(fn);

   fnRef.current = useMemo(() => fn, [fn]);
   const memoizedFn = useRef<PickFunction<T>>();
   if (!memoizedFn.current) {
     memoizedFn.current = function (this, ...args) {
        return fnRef.current.apply(this, args);
     }
   }

   return memoizedFn.current as T;
}

export default useMemoizedFn;