import useBoolean from '../useBoolean';
import useEventListener from '../useEventListener';
import type { BasicTarget } from '../utils/domTarget';

export interface Options {
    onEnter?: () => void;
    onLeave?: () => void;
    onChange?: (isHovering: boolean) => void;
}

/**
 * 自定义hook，用于监听元素的悬停事件
 * @param target 目标元素，可以是DOM元素、函数返回DOM元素、ref对象
 * @param options 选项对象，包含onEnter、onLeave和onChange回调函数
 * @returns 一个布尔值，表示元素是否处于悬停状态
 */
const useHover = (target: BasicTarget, options?: Options): boolean => {
    const { onEnter, onLeave, onChange } = options || {};

    const [state, { setTrue, setFalse }] = useBoolean(false);

    useEventListener(
        'mouseenter',
        () => {
            onEnter?.();
            setTrue();
            onChange?.(true);
        },
        {
            target,
        },
    );

    useEventListener(
        'mouseleave',
        () => {
            onLeave?.();
            setFalse();
            onChange?.(false);
        },
        {
            target,
        },
    );

    return state;
}

export default useHover;