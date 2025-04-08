import useMemoizedFn from '../useMemoizedFn';
import useUpdate from '../useUpdate';
import qs from 'query-string';
import type { ParseOptions, StringifyOptions } from 'query-string';
import { useMemo, useRef } from 'react';
import type * as React from 'react';
import * as tmp from 'react-router';

const rc = tmp as any;

export interface Options {
    navigateMode?: 'push' | 'replace';
    parseOptions?: ParseOptions;
    stringifyOptions?: StringifyOptions;
}

const baseParseConfig: ParseOptions = {
    parseNumbers: false,
    parseBooleans: false,
};

const baseStringifyConfig: StringifyOptions = {
    skipNull: false,
    skipEmptyString: false,
};

type UrlState = Record<string, any>;

/**
 * 用于管理 URL 中的查询参数状态。
 * @param initialState 初始状态对象，或者一个返回初始状态对象的函数。
 * @param options 配置选项。
 */
const useUrlState = <S extends UrlState = UrlState>(
    initialState?: S | (() => S),
    options?: Options,
) => {
    type State = Partial<{ [key in keyof S]: any }>;
    const { navigateMode = 'push', parseOptions, stringifyOptions } = options || {};

    const mergedParseOptions = { ...baseParseConfig, ...parseOptions };
    const mergedStringifyOptions = { ...baseStringifyConfig, ...stringifyOptions };

    const location = rc.useLocation();
    // react-router v5
    const history = rc.useHistory?.();
    // react-router v6
    const navigate = rc.useNavigate?.();

    const update = useUpdate();

    const initialStateRef = useRef(
        typeof initialState === 'function' ? (initialState as () => S)() : initialState || {},
    );

    const queryFromUrl = useMemo(() => {
        return qs.parse(location.search, mergedParseOptions);
    }, [location.search]);

    const targetQuery: State = useMemo(
        () => ({
            ...initialStateRef.current,
            ...queryFromUrl,
        }),
        [queryFromUrl],
    );

    const setState = (s: React.SetStateAction<State>) => {
        const newQuery = typeof s === 'function' ? s(targetQuery) : s;

        // 1. 如果 setState 后，search 没变化，就需要 update 来触发一次更新。比如 demo1 直接点击 clear，就需要 update 来触发更新。
        // 2. update 和 history 的更新会合并，不会造成多次更新
        update();
        if (history) {
            history[navigateMode](
                {
                    hash: location.hash,
                    search: qs.stringify({ ...queryFromUrl, ...newQuery }, mergedStringifyOptions) || '?',
                },
                location.state,
            );
        }
        if (navigate) {
            navigate(
                {
                    hash: location.hash,
                    search: qs.stringify({ ...queryFromUrl, ...newQuery }, mergedStringifyOptions) || '?',
                },
                {
                    replace: navigateMode === 'replace',
                    state: location.state,
                },
            );
        }
    };

    return [targetQuery, useMemoizedFn(setState)] as const;
}

export default useUrlState;