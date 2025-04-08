import type { DependencyList } from 'react';
import { isEqual } from 'lodash-es';

/**
 * 比较两个依赖数组是否相等
 * @param aDeps 第一个依赖数组
 * @param bDeps 第二个依赖数组
 * @returns 如果两个依赖数组相等，则返回 true，否则返回 false
 */
export const depsEqual = (aDeps: DependencyList = [], bDeps: DependencyList = []) =>
    isEqual(aDeps, bDeps);