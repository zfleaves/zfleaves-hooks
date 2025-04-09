import type { DependencyList } from 'react';
import { useRef } from 'react';
import depsAreSame from '../utils/depsAreSame';

/**
 * 一个用于创建和缓存对象的 Hook，保证对象的引用稳定性。
 * @param factory - 工厂函数，用于创建值
 * @param deps - 依赖项列表
 * @returns 创建的值
 */
export default function useCreation<T>(factory: () => T, deps: DependencyList) {
    const { current } = useRef({
        deps,
        obj: undefined as undefined | T,
        initialized: false,
    });

    if (current.initialized === false || !depsAreSame(current.deps, deps)) {
        current.deps = deps;
        current.obj = factory();
        current.initialized = true;
    }
    return current.obj as T;
}