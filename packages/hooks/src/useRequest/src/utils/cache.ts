type Timer = ReturnType<typeof setTimeout>;
type CachedKey = string | number;

export interface CachedData<TData = any, TParams = any> {
    data: TData;
    params: TParams;
    time: number
}

interface RecordData extends CachedData {
    timer: Timer | undefined;
}

const cache = new Map<CachedKey, RecordData>();

const setCache = (key: CachedKey, cacheTime: number, cachedData: CachedData) => {
    const currentCache = cache.get(key);
    if (currentCache?.timer) {
        clearTimeout(currentCache.timer);
    }

    let timer: Timer | undefined = undefined;

    if (cacheTime > -1) {
        timer = setTimeout(() => {
            cache.delete(key);
        }, cacheTime);
    }

    cache.set(key, { ...cachedData, timer });
}


const getCache = (key: CachedKey) => {
    return cache.get(key);
};

const clearCache = (key?: string | string[]) => {
    if (key) {
        const cacheKeys = Array.isArray(key) ? key : [key];
        cacheKeys.forEach((key) => {
            cache.delete(key);
        });
    } else {
        cache.clear();
    }
}

export { getCache, setCache, clearCache };