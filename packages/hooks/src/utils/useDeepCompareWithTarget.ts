import type { DependencyList, EffectCallback } from 'react';
import { useRef } from 'react';
import type { BasicTarget } from './domTarget';
import useEffectWithTarget from './useEffectWithTarget';
import { depsEqual } from './depsEqual';

/**
 * 创建一个带有目标元素的 effect Hook，依赖数组进行深度比较
 * @param effect 副作用函数
 * @param deps 依赖数组
 * @param target 目标元素，可以是单个目标或目标数组
 * @returns 无返回值
 */
const useDeepCompareEffectWithTarget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: BasicTarget<any> | BasicTarget<any>[],
) => {
    const ref = useRef<DependencyList>();
    const signalRef = useRef<number>(0);

    if (!depsEqual(deps, ref.current)) {
        ref.current = deps;
        signalRef.current += 1;
    }

    useEffectWithTarget(effect, [signalRef.current], target);
};

export default useDeepCompareEffectWithTarget;

