import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import useUnmount from '../useUnmount';

function useRafState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useRafState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

/**
 * 用于在 React 中使用 requestAnimationFrame 来管理状态的 Hook。
 * @param initialState 初始状态，可以是一个值或一个函数，用于延迟初始化状态。
 * @returns 一个数组，包含当前状态和一个用于更新状态的函数。
 */
function useRafState<S>(initialState?: S | (() => S)) {
    const ref = useRef(0);

    const [state, setState] = useState(initialState);

    const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
        cancelAnimationFrame(ref.current);

        ref.current = requestAnimationFrame(() => {
            setState(value);
        });
    }, []);

    useUnmount(() => {
        cancelAnimationFrame(ref.current);
    });

    return [state, setRafState] as const;
}

export default useRafState;