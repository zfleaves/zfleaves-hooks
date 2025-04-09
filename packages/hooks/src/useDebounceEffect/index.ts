import { useEffect, useState } from 'react';
import type { DependencyList, EffectCallback } from 'react';
import type { DebounceOptions } from '../useDebounce/debounceOptions';
import useDebounceFn from '../useDebounceFn';
import useUpdateEffect from '../useUpdateEffect';

/**
 * 防抖的 useEffect
 * @param effect 副作用函数
 * @param deps 依赖数组
 * @param options 防抖选项
 */
function useDebounceEffect(
    effect: EffectCallback,
    deps?: DependencyList,
    options?: DebounceOptions,
) {
    const [flag, setFlag] = useState({});

    const { run } = useDebounceFn(() => {
        setFlag({});
    }, options);

    useEffect(() => {
        return run();
    }, deps);

    useUpdateEffect(effect, [flag]);
}

export default useDebounceEffect;