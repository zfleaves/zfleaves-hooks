import type { DependencyList } from 'react';
import { useEffect, useRef } from 'react';

type Effect<T extends DependencyList> = (
    changes?: number[],
    previousDeps?: T,
    currentDeps?: T,
) => void | (() => void);

const diffTwoDeps = (deps1?: DependencyList, deps2?: DependencyList) => {
    //Let's do a reference equality check on 2 dependency list.
    //If deps1 is defined, we iterate over deps1 and do comparison on each element with equivalent element from deps2
    //As this func is used only in this hook, we assume 2 deps always have same length.
    return deps1
        ? deps1.map((_ele, idx) => (!Object.is(deps1[idx], deps2?.[idx]) ? idx : -1)).filter((ele) => ele >= 0)
        : deps2 ? deps2.map((_ele, idx) => idx) : [];
};

/**
 * 使用一个带有依赖项列表的副作用钩子。
 * @param effect 需要执行的副作用函数。
 * @param deps 依赖项列表。如果deps变化，则会重新运行effect。
 * @returns 无返回值。
 */
const useTrackedEffect = <T extends DependencyList>(effect: Effect<T>, deps?: [...T]) => {
    const previousDepsRef = useRef<T>();

    useEffect(() => {
        const changes = diffTwoDeps(previousDepsRef.current, deps);
        const previousDeps = previousDepsRef.current;
        previousDepsRef.current = deps;
        return effect(changes, previousDeps, deps);
    }, deps);
};

export default useTrackedEffect;