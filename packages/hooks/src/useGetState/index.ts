import type { Dispatch, SetStateAction } from 'react';
import { useState, useRef, useCallback } from 'react';

type GetStateAction<T> = () => T;

function useGetState<T>(
    initialState: T | (() => T),
): [T, Dispatch<SetStateAction<T>>, GetStateAction<T>]

function useGetState<T = undefined>(): [
    T | undefined,
    Dispatch<SetStateAction<T | undefined>>,
    GetStateAction<T | undefined>,
]

function useGetState<T>(initialState?: T) {
    const [state, setState] = useState(initialState);
    const stateRef = useRef(state);
    stateRef.current = state;

    const getState = useCallback(() => stateRef.current, []);

    return [state, setState, getState];
}

export default useGetState;