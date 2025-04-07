import { useRef } from 'react';
import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import isBrowser from '../utils/isBrowser';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type EventType = MouseEvent | TouchEvent;

export interface Options {
    delay?: number;
    moveThreshold?: { x?: number; y?: number };
    onClick?: (event: EventType) => void;
    onLongPressEnd?: (event: EventType) => void;
}
const touchSupported =
    isBrowser &&
    // @ts-ignore
    ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch));
    
/**
 * 监听鼠标或触摸事件，当长按时触发回调
 * @param onLongPress 长按回调
 * @param target 目标元素
 * @param options 配置
 * @returns 取消监听函数
 */
function useLongPress(
    onLongPress: (event: EventType) => void,
    target: BasicTarget,
    { delay = 300, moveThreshold, onClick, onLongPressEnd }: Options = {},
) {
    // 使用useLatest保持回调函数的最新引用
    const onLongPressRef = useLatest(onLongPress);
    const onClickRef = useLatest(onClick);
    const onLongPressEndRef = useLatest(onLongPressEnd);

    // 用于存储setTimeout的引用
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    // 标记是否已经触发了长按事件
    const isTriggeredRef = useRef(false);
    // 记录上一次的鼠标/触摸位置
    const pervPositionRef = useRef({ x: 0, y: 0 });
    // 判断是否设置了移动阈值
    const hasMoveThreshold = !!(
        (moveThreshold?.x && moveThreshold.x > 0) ||
        (moveThreshold?.y && moveThreshold.y > 0)
    );

    useEffectWithTarget(
        () => {
            // 获取目标元素
            const targetElement = getTargetElement(target);
            if (!targetElement?.addEventListener) {
                return;
            }

            // 判断当前移动是否超过设定的阈值
            const overThreshold = (event: EventType) => {
                const { clientX, clientY } = getClientPosition(event);
                const offsetX = Math.abs(clientX - pervPositionRef.current.x);
                const offsetY = Math.abs(clientY - pervPositionRef.current.y);

                return !!(
                    (moveThreshold?.x && offsetX > moveThreshold.x) ||
                    (moveThreshold?.y && offsetY > moveThreshold.y)
                );
            };

            // 获取鼠标或触摸事件的当前位置
            function getClientPosition(event: EventType) {
                if (event instanceof TouchEvent) {
                    return {
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                    };
                }

                if (event instanceof MouseEvent) {
                    return {
                        clientX: event.clientX,
                        clientY: event.clientY,
                    };
                }

                console.warn('Unsupported event type');

                return { clientX: 0, clientY: 0 };
            }

            // 处理鼠标按下或触摸开始事件
            const onStart = (event: EventType) => {
                if (hasMoveThreshold) {
                    const { clientX, clientY } = getClientPosition(event);
                    pervPositionRef.current.x = clientX;
                    pervPositionRef.current.y = clientY;
                }
                // 启动定时器，延迟触发长按事件
                timerRef.current = setTimeout(() => {
                    onLongPressRef.current(event);
                    isTriggeredRef.current = true;
                }, delay);
            };

            // 处理移动事件，检测是否超过阈值
            const onMove = (event: TouchEvent) => {
                if (timerRef.current && overThreshold(event)) {
                    clearInterval(timerRef.current);
                    timerRef.current = undefined;
                }
            };

            // 处理鼠标抬起或触摸结束事件
            const onEnd = (event: EventType, shouldTriggerClick: boolean = false) => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
                if (isTriggeredRef.current) {
                    onLongPressEndRef.current?.(event);
                }
                // 如果没有触发长按且需要触发点击，执行点击回调
                if (shouldTriggerClick && !isTriggeredRef.current && onClickRef.current) {
                    onClickRef.current(event);
                }
                isTriggeredRef.current = false;
            };

            // 包装onEnd函数，确保触发点击事件
            const onEndWithClick = (event: EventType) => onEnd(event, true);

            // 根据设备支持情况添加相应的事件监听器
            if (!touchSupported) {
                targetElement.addEventListener('mousedown', onStart);
                targetElement.addEventListener('mouseup', onEndWithClick);
                targetElement.addEventListener('mouseleave', onEnd);
                if (hasMoveThreshold) targetElement.addEventListener('mousemove', onMove);
            } else {
                targetElement.addEventListener('touchstart', onStart);
                targetElement.addEventListener('touchend', onEndWithClick);
                if (hasMoveThreshold) targetElement.addEventListener('touchmove', onMove);
            }

            // 清理函数
            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    isTriggeredRef.current = false;
                }
                if (!touchSupported) {
                    targetElement.removeEventListener('mousedown', onStart);
                    targetElement.removeEventListener('mouseup', onEndWithClick);
                    targetElement.removeEventListener('mouseleave', onEnd);
                    if (hasMoveThreshold) targetElement.removeEventListener('mousemove', onMove);
                } else {
                    targetElement.removeEventListener('touchstart', onStart);
                    targetElement.removeEventListener('touchend', onEndWithClick);
                    if (hasMoveThreshold) targetElement.removeEventListener('touchmove', onMove);
                }
            };
        },
        [],
        target,
    );
}

export default useLongPress;