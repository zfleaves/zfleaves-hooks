import { useEffect, useState } from 'react';
import type { DependencyList, EffectCallback } from 'react';
import type { ThrottleOptions } from '../useThrottle/throttleOptions';
import useThrottleFn from '../useThrottleFn';
import useUpdateEffect from '../useUpdateEffect';

/**
 * 只在依赖更新时执行的节流 Hook。
 * @param effect 要执行的函数。
 * @param deps 依赖数组。
 * @param options 节流选项。
 */ 
function useThrottleEffect(
    effect: EffectCallback,
    deps?: DependencyList,
    options?: ThrottleOptions,
) {
    const [flag, setFlag] = useState({});

    const { run } = useThrottleFn(() => {
        setFlag({});
    }, options);

    useEffect(() => {
        return run();
    }, deps);

    useUpdateEffect(effect, [flag]);
}

export default useThrottleEffect;