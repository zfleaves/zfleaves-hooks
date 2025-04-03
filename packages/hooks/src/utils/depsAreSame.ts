import type { DependencyList } from 'react';

export default function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
    // 如果 oldDeps 和 deps 是同一个引用，直接返回 true
    if (oldDeps === deps) return true;

    // 遍历 oldDeps 和 deps 的每个元素，使用 Object.is 进行比较
    for (let i = 0; i < oldDeps.length; i++) {
        // 如果发现不相同的元素，返回 false
        if (!Object.is(oldDeps[i], deps[i])) return false;
    }

    // 如果所有元素都相同，返回 true
    return true;
}