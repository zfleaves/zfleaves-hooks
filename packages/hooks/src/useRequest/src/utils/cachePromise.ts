type CachedKey = string | number;
const cachePromise = new Map<CachedKey, Promise<any>>();

const getCachePromise = (cacheKey: CachedKey) => {
    return cachePromise.get(cacheKey);
};

const setCachePromise = (cacheKey: CachedKey, promise: Promise<any>) => {
    cachePromise.set(cacheKey, promise);

    promise.then((res) => {
        cachePromise.delete(cacheKey);
        return res;
    }).catch((err) => {
        cachePromise.delete(cacheKey);
    })
}

export { getCachePromise, setCachePromise };
