import { useState } from 'react';
import useEventListener from '../useEventListener';
import type { BasicTarget } from '../utils/domTarget';

export interface Options {
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    onChange?: (isFocusWithin: boolean) => void;
}

/**
 * 自定义hook，用于监听元素的焦点事件
 * @param target 目标元素，可以是DOM元素、函数返回DOM元素、ref对象
 * @param options 选项对象，包含onFocus、onBlur和onChange回调函数
 * @returns 一个布尔值，表示元素是否处于焦点状态
 */
export default function useFocusWithin(target: BasicTarget, options?: Options) {
    const [isFocusWithin, setIsFocusWithin] = useState(false);
    const { onFocus, onBlur, onChange } = options || {};

    useEventListener(
        'focusin',
        (e: FocusEvent) => {
            if (!isFocusWithin) {
                onFocus?.(e);
                onChange?.(true);
                setIsFocusWithin(true);
            }
        },
        {
            target
        }
    )

    useEventListener(
        'focusout',
        (e: FocusEvent) => {
            if (isFocusWithin && !(e.currentTarget as Element)?.contains?.(e.relatedTarget as Element)) {
                onBlur?.(e);
                onChange?.(false);
                setIsFocusWithin(false);
            }
        },
        {
            target,
        },
    );

    return isFocusWithin;
}