import type { DebouncedFunc, DebounceSettings } from 'lodash';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef } from 'react';
import type { Plugin } from '../types';

const useDebouncePlugin: Plugin<any, any[]> = (
    fetchInstance,
    { debounceWait, debounceLeading, debounceTrailing, debounceMaxWait },
) => {
    const debouncedRef = useRef<DebouncedFunc<any>>();

    const options = useMemo(() => {
        const ret: DebounceSettings = {};
        if (debounceLeading !== undefined) {
            ret.leading = debounceLeading;
        }
        if (debounceTrailing !== undefined) {
            ret.trailing = debounceTrailing;
        }
        if (debounceMaxWait !== undefined) {
            ret.maxWait = debounceMaxWait;
        }
        return ret;
    }, [debounceLeading, debounceTrailing, debounceMaxWait]);

    useEffect(() => {
        if (debounceWait) {
            // 保存原始的 runAsync 方法
            const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

            debouncedRef.current = debounce(
                (callback) => {
                    callback();
                },
                debounceWait,
                options,
            );
            // 重写 runAsync 方法，添加防抖逻辑
            fetchInstance.runAsync = (...args) => {
                return new Promise((resolve, reject) => {
                    debouncedRef.current?.(() => {
                        _originRunAsync(...args)
                            .then(resolve)
                            .catch(reject);
                    });
                });
            };

            // 清理函数
            return () => {
                debouncedRef.current?.cancel();  // 取消未执行的防抖函数
                fetchInstance.runAsync = _originRunAsync;  // 恢复原始方法
            };
        }
    }, [debounceWait, options])

    if (!debounceWait) {
        return {};
    }

    return {
        onCancel: () => {
            debouncedRef.current?.cancel();
        },
    };
}

export default useDebouncePlugin;