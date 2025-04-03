import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import getDocumentOrShadow from '../utils/getDocumentOrShadow';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type DocumentEventKey = keyof DocumentEventMap;

export default function useClickAway<T extends Event = Event>(
    // 点击外部区域时触发的回调函数
    onClickAway: (event: T) => void,
    // 目标元素，可以是单个目标或目标数组
    target?: BasicTarget | BasicTarget[],
    // 监听的事件名称，默认为 'click'
    eventName: DocumentEventKey | DocumentEventKey[] = 'click',
) {
    // 使用 useLatest 获取 onClickAway 的最新引用
    const onClickAwayRef = useLatest(onClickAway);

    // 使用 useEffectWithTarget 监听事件
    useEffectWithTarget(
        () => {
            // 事件处理函数
            const handler = (event: any) => {
                // 将目标统一转换为数组形式
                const targets = Array.isArray(target) ? target : [target];

                // 检查事件目标是否在目标元素内部
                if (
                    targets.some((item) => {
                        const targetElement = getTargetElement(item);
                        // @ts-ignore
                        return !targetElement || targetElement.contains(event.target);
                    })
                ) {
                    // 如果事件目标在目标元素内部，直接返回
                    return;
                }

                // 触发 onClickAway 回调
                onClickAwayRef.current(event);
            };

            // 获取文档或 Shadow DOM 的根节点
            const documentOrShadow = getDocumentOrShadow(target);

            // 将事件名称统一转换为数组形式
            const eventNames = Array.isArray(eventName) ? eventName : [eventName];

            // 监听事件
            eventNames.forEach((event) => documentOrShadow.addEventListener(event, handler));

            // 返回清理函数，用于移除事件监听
            return () => {
                eventNames.forEach((event) => documentOrShadow.removeEventListener(event, handler));
            };
        },
        // 依赖项：事件名称
        Array.isArray(eventName) ? eventName : [eventName],
        // 依赖项：目标元素
        target
    )
}


