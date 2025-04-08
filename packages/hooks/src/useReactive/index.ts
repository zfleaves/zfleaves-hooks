import { useRef } from 'react';
import isPlainObject from 'lodash-es/isPlainObject';
import useCreation from '../useCreation';
import useUpdate from '../useUpdate';

// k:v 原对象:代理过的对象
const proxyMap = new WeakMap();
// k:v 代理过的对象:原对象
const rawMap = new WeakMap();

function observer<T extends Record<string, any>>(initialVal: T, cb: () => void): T {
    const existingProxy = proxyMap.get(initialVal);

    // 添加缓存 防止重新构建proxy
    if (existingProxy) {
        return existingProxy;
    }

    // 防止代理已经代理过的对象
    if (rawMap.has(initialVal)) {
        return initialVal;
    }

    const proxy = new Proxy<T>(initialVal, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);

            // 只读且不可配置的数据属性
            const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
            if (!descriptor?.configurable && !descriptor?.writable) {
                return res;
            }
            // 只代理对象或者数组，否则返回本身
            return isPlainObject(res) || Array.isArray(res) ? observer(res, cb) : res;
        },
        set(target, key, val) {
            const ret = Reflect.set(target, key, val);
            cb();
            return ret;
        },
        deleteProperty(target, key) {
            const ret = Reflect.deleteProperty(target, key);
            cb();
            return ret;
        },
    })

    proxyMap.set(initialVal, proxy);
    rawMap.set(proxy, initialVal);

    return proxy;
}


/**
 * 将给定的初始状态转换为响应式对象
 * @param initialState 初始状态，需要是一个对象
 * @returns 返回转换后的响应式对象
 */
function useReactive<S extends Record<string, any>>(initialState: S): S {
    const update = useUpdate();
    const stateRef = useRef<S>(initialState);

    const state = useCreation(() => {
        return observer(stateRef.current, () => {
            update();
        });
    }, []);

    return state;
}

export default useReactive;
