import { useMemo, useState } from 'react';

// 定义Actions接口，包含四个操作方法
export interface Actions<T> {
  setLeft: () => void;   // 设置为默认值
  setRight: () => void;  // 设置为反向值
  set: (value: T) => void;  // 自定义设置值
  toggle: () => void;    // 切换值
}

// 定义useToggle函数的重载签名
function useToggle<T = boolean>(): [boolean, Actions<T>];
function useToggle<T>(defaultValue: T): [T, Actions<T>];
function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];

// useToggle实现函数
function useToggle<D, R>(defaultValue: D = (false as unknown) as D, reverseValue?: R) {
  // 使用useState管理状态，初始值为defaultValue
  const [state, setState] = useState<D | R>(defaultValue);

  // 使用useMemo缓存actions对象，避免每次渲染都重新创建
  const actions = useMemo(() => {
    // 计算反向值，如果未提供reverseValue，则使用!defaultValue
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    // 定义toggle方法，在defaultValue和reverseValueOrigin之间切换
    const toggle = () => setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));
    // 定义set方法，直接设置新值
    const set = (value: D | R) => setState(value);
    // 定义setLeft方法，设置为defaultValue
    const setLeft = () => setState(defaultValue);
    // 定义setRight方法，设置为reverseValueOrigin
    const setRight = () => setState(reverseValueOrigin);

    // 返回包含所有方法的对象
    return {
      toggle,
      set,
      setLeft,
      setRight,
    };
  }, []);  // 空依赖数组表示只在组件挂载时创建一次

  // 返回当前状态和操作方法
  return [state, actions];
}

export default useToggle;
