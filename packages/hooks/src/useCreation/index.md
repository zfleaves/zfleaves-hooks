---
nav:
  path: /hooks
---

# useCreation

一个用于创建和缓存对象的 Hook，保证对象的引用稳定性。

## 特性

- 🚀 保证对象引用的稳定性
- 💪 不受 React 并发特性的影响
- 🎯 只在依赖变化时重新创建对象
- 🔄 支持任意类型的对象创建

## 与 useMemo 的对比

`useCreation` 是 `useMemo` 或 `useRef` 的替代品。因为 `useMemo` 不能保证被 memo 的值一定不会被重新计算，而 `useCreation` 可以保证这一点。

> **You may rely on useMemo as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

### useMemo 的局限性

1. **React 的并发特性**
   - React 18 引入了并发渲染（Concurrent Rendering）特性
   - 在并发模式下，React 可能会中断、暂停或放弃渲染
   - 这意味着即使依赖没有变化，`useMemo` 的值也可能被重新计算

2. **React 的内部优化**
   - React 在某些情况下会故意重新计算 `useMemo` 的值
   - 这是为了在开发模式下帮助开发者发现潜在的问题
   - 在生产环境中，React 也会根据内部启发式算法决定是否重新计算

3. **内存管理**
   - React 可能会在内存压力大的情况下释放一些 memo 的值
   - 这是为了优化内存使用，防止内存泄漏

4. **依赖比较机制**
   - `useMemo` 使用 `Object.is` 进行依赖比较
   - 如果依赖是对象或数组，即使内容相同，引用不同也会触发重新计算

### 与 useRef 的对比

而相比于 `useRef`，你可以使用 `useCreation` 创建一些常量，这些常量和 `useRef` 创建出来的 ref 有很多使用场景上的相似，但对于复杂常量的创建，`useRef` 却容易出现潜在的性能隐患。

```javascript
const a = useRef(new Subject()); // 每次重渲染，都会执行实例化 Subject 的过程，即便这个实例立刻就被扔掉了
const b = useCreation(() => new Subject(), []); // 通过 factory 函数，可以避免性能隐患
```

## 代码演示

### 基础用法

<code src="./demo/demo1.tsx" />

## API

```typescript
function useCreation<T>(factory: () => T, deps: DependencyList): T;
```

### Params

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| factory | 创建对象的工厂函数 | `() => T` | - |
| deps | 依赖数组 | `DependencyList` | - |

### Result

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| obj | 创建的对象 | `T` |

## 使用建议

### 选择指南

1. 对于简单的值计算，使用 `useMemo`
2. 对于需要稳定引用的对象创建，使用 `useCreation`
3. 对于事件处理函数，优先使用 `useCallback` 或 `useCreation`
4. 在并发模式下，如果对象的稳定性很重要，选择 `useCreation`

## 注意事项

- 确保 `factory` 函数是纯函数
- 正确设置依赖数组，避免不必要的重新创建
- 在开发模式下注意观察对象的创建时机
