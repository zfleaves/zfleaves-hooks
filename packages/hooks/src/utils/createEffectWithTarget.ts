import { DependencyList, EffectCallback, useEffect, useLayoutEffect } from 'react';
import { useRef } from 'react';
import useUnmount from '../useUnmount';
import depsAreSame from './depsAreSame';
import type { BasicTarget } from './domTarget';
import { getTargetElement } from './domTarget';

const createEffectWithTarget = (useEffectType: typeof useEffect | typeof useLayoutEffect) => {
    /**
     * 创建一个带有目标元素的 effect Hook
     * @param effect 副作用函数
     * @param deps 依赖数组
     * @param target 目标元素，可以是单个目标或目标数组
     */

    const useEffectWithTarget = (
        effect: EffectCallback,
        deps: DependencyList,
        target: BasicTarget<any> | BasicTarget<any>[],
    ) => {
        // 用于标记是否是首次执行
        const hasInitRef = useRef(false);

        // 用于存储上一次的目标元素
        const lastElementRef = useRef<(Element | null)[]>([]);

        // 用于存储上一次的依赖数组
        const lastDepsRef = useRef<DependencyList>([]);

        // 用于存储副作用函数的清理函数
        const unLoadRef = useRef<any>();

        useEffectType(() => {
            // 将目标统一转换为数组形式
            const targets = Array.isArray(target) ? target : [target];

            // 获取目标元素
            const els = targets.map((item) => getTargetElement(item));

            // 首次执行
            if (!hasInitRef.current) {
                hasInitRef.current = true;
                lastElementRef.current = els;
                lastDepsRef.current = deps;

                // 执行副作用函数并存储清理函数
                unLoadRef.current = effect();
                return;
            }

            // 如果目标元素或依赖发生变化
            if (
                els.length !== lastElementRef.current.length ||
                !depsAreSame(els, lastElementRef.current) ||
                !depsAreSame(deps, lastDepsRef.current)
            ) {
                // 执行上一次的清理函数
                unLoadRef.current?.();

                // 更新目标元素和依赖数组
                lastElementRef.current = els;
                lastDepsRef.current = deps;

                // 执行新的副作用函数并存储清理函数
                unLoadRef.current = effect();
            }
        })

        // 组件卸载时执行清理函数
        useUnmount(() => {
            unLoadRef.current?.();
            // 重置初始化标记，用于 react-refresh
            hasInitRef.current = false;
        });
    }

    return useEffectWithTarget;
}

export default createEffectWithTarget;
