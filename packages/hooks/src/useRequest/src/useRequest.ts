import useAutoRunPlugin from './plugins/useAutoRunPlugin';
import useCachePlugin from './plugins/useCachePlugin';
import useDebouncePlugin from './plugins/useDebouncePlugin';
import useLoadingDelayPlugin from './plugins/useLoadingDelayPlugin';
import usePollingPlugin from './plugins/usePollingPlugin';
import useRefreshOnWindowFocusPlugin from './plugins/useRefreshOnWindowFocusPlugin';
import useRetryPlugin from './plugins/useRetryPlugin';
import useThrottlePlugin from './plugins/useThrottlePlugin';
import type { Options, Plugin, Service } from './types';
import useRequestImplement from './useRequestImplement';

function useRequest<TData, TParams extends any[]>(
    service: Service<TData, TParams>,
    options?: Options<TData, TParams>,
    plugins?: Plugin<TData, TParams>[],
) {
    return useRequestImplement(service, options, [
        ...(plugins || []),
        useDebouncePlugin,
        useLoadingDelayPlugin,
        usePollingPlugin,
        useRefreshOnWindowFocusPlugin,
        useThrottlePlugin,
        useAutoRunPlugin,
        useCachePlugin,
        useRetryPlugin,
    ] as Plugin<TData, TParams>[])
}

export default useRequest;
