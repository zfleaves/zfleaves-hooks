import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type noop = (...args: any) => void;

export type Target = BasicTarget<HTMLElement | Element | Window | Document>;

type Options<T extends Target = Target> = {
    target?: T;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
    enable?: boolean;
};

function useEventListener<K extends keyof HTMLElementEventMap>(
    eventName: K,
    handler: (ev: HTMLElementEventMap[K]) => void,
    options?: Options<HTMLElement>,
): void;
function useEventListener<K extends keyof ElementEventMap>(
    eventName: K,
    handler: (ev: ElementEventMap[K]) => void,
    options?: Options<Element>,
): void;
function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (ev: DocumentEventMap[K]) => void,
    options?: Options<Document>,
): void;
function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (ev: WindowEventMap[K]) => void,
    options?: Options<Window>,
): void;
function useEventListener(eventName: string, handler: noop, options: Options): void;

/**
 * 监听事件
 * @param eventName 事件名称
 * @param handler 事件处理函数
 * @param options 配置项
 */
function useEventListener(eventName: string, handler: noop, options: Options = {}) {
    const { enable = true } = options;

    const handlerRef = useLatest(handler);

    useEffectWithTarget(
        () => {
            if (!enable) {
                return;
            }
            
            const targetElement = getTargetElement(options.target, window);
            if (!targetElement?.addEventListener) {
                return;
            }

            const eventListener = (event: Event) => {
                return handlerRef.current(event);
            };

            targetElement.addEventListener(eventName, eventListener, {
                capture: options.capture,
                once: options.once,
                passive: options.passive,
            });

            return () => {
                targetElement.removeEventListener(eventName, eventListener, {
                    capture: options.capture,
                });
            };
        },
        [eventName, options.capture, options.once, options.passive],
        options.target,
    );
}

export default useEventListener;
