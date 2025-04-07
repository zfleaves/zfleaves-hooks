import 'intersection-observer';
import { useState } from 'react';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type CallbackType = (entry: IntersectionObserverEntry) => void;

interface Options {
    rootMargin?: string;
    threshold?: number | number[];
    root?: BasicTarget<Element>;
    callback?: CallbackType;
}

/**
 * 监听元素是否进入可视区域
 * @param target 元素
 * @param options 配置
 * @returns [是否进入可视区域, 元素进入可视区域的比例]
 */ 
function useInViewport(target: BasicTarget | BasicTarget[], options?: Options) {
    const { callback, ...option } = options || {};

    const [state, setState] = useState<boolean>();
    const [ratio, setRatio] = useState<number>();

    useEffectWithTarget(
        () => {
            const targets = Array.isArray(target) ? target : [target];
            const els = targets.map((element) => getTargetElement(element)).filter(Boolean);

            if (!els.length) {
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        setRatio(entry.intersectionRatio);
                        setState(entry.isIntersecting);
                        callback?.(entry);
                    }
                },
                {
                    ...option,
                    root: getTargetElement(options?.root),
                }
            )

            els.forEach((el) => {
                if (el) {
                    // @ts-ignore
                    observer.observe(el);
                }
            });

            return () => {
                observer.disconnect();
            };
        },
        [options?.rootMargin, options?.threshold, callback],
        target,
    )

    return [state, ratio] as const;
}

export default useInViewport;