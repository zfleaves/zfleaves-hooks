import { useEffect } from 'react';
import useLatest from '../useLatest';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

function useUnmount(fn: () => void) {
    if (isDev) {
        if (!isFunction(fn)) {
            console.error(`useUnmount expected parameter is a function, got ${typeof fn}`);
        }
    }

    // 确保传入的函数是最新的版本，防止闭包问题。
    // 例如，当组件卸载时，如果传入的函数是闭包，可能会导致引用到错误的状态或变量。
    const fnRef = useLatest(fn);

    useEffect(
        () => () => {
            fnRef.current();
        },
        [],
    );
}

export default useUnmount;