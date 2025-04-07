import { useRef } from 'react';
import useLatest from '../useLatest';
import useMount from '../useMount';
import { isString } from '../utils';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

// 定义拖拽选项接口
export interface Options {
    // 拖拽开始时的回调函数
    onDragStart?: (event: React.DragEvent) => void;
    // 拖拽结束时的回调函数
    onDragEnd?: (event: React.DragEvent) => void;
    // 拖拽时显示的图片配置
    dragImage?: {
        // 图片资源，可以是URL字符串或Element对象
        image: string | Element;
        // 图片的水平偏移量
        offsetX?: number;
        // 图片的垂直偏移量
        offsetY?: number;
    };
}

/**
 * 自定义hook，用于实现元素的拖拽功能
 * @param data 要拖拽的数据，可以是任意类型
 * @param target 目标元素，可以是DOM元素、函数返回DOM元素、ref对象
 * @param options 拖拽选项，包含onDragStart和onDragEnd回调函数
 */
const useDrag = <T>(data: T, target: BasicTarget, options: Options = {}) => {
    // 使用useLatest保持options的最新值
    const optionsRef = useLatest(options);
    // 使用useLatest保持data的最新值
    const dataRef = useLatest(data);
    // 用于存储拖拽图片元素的引用
    const imageElementRef = useRef<Element>();

    // 从options中解构出dragImage配置
    const { dragImage } = optionsRef.current;

    // 在组件挂载时初始化拖拽图片
    useMount(() => {
        if (dragImage?.image) {
            const { image } = dragImage;

            // 如果图片是字符串（URL），创建一个新的Image对象
            if (isString(image)) {
                const imageElement = new Image();
                imageElement.src = image;
                imageElementRef.current = imageElement;
            } else {
                // 如果图片是Element对象，直接使用
                imageElementRef.current = image;
            }
        }
    })

    // 使用useEffectWithTarget在目标元素上添加事件监听
    useEffectWithTarget(
        () => {
            // 获取目标元素
            const targetElement = getTargetElement(target);
            // 如果目标元素不存在或不能添加事件监听，直接返回
            if (!targetElement?.addEventListener) {
                return;
            }

            // 拖拽开始事件处理函数
            const onDragStart = (event: React.DragEvent) => {
                // 调用用户提供的onDragStart回调
                optionsRef.current.onDragStart?.(event);
                // 将数据存储在dataTransfer中
                event.dataTransfer.setData('custom', JSON.stringify(dataRef.current));

                // 如果配置了拖拽图片，设置拖拽图片
                if (dragImage?.image && imageElementRef.current) {
                    const { offsetX = 0, offsetY = 0 } = dragImage;
                    event.dataTransfer.setDragImage(imageElementRef.current, offsetX, offsetY);
                }
            };

            // 拖拽结束事件处理函数
            const onDragEnd = (event: React.DragEvent) => {
                // 调用用户提供的onDragEnd回调
                optionsRef.current.onDragEnd?.(event);
            };

            // 设置目标元素为可拖拽
            // @ts-ignore
            targetElement.setAttribute('draggable', 'true');

            // 添加事件监听
            targetElement.addEventListener('dragstart', onDragStart as any);
            targetElement.addEventListener('dragend', onDragEnd as any);

            // 清理函数：移除事件监听
            return () => {
                targetElement.removeEventListener('dragstart', onDragStart as any);
                targetElement.removeEventListener('dragend', onDragEnd as any);
            };
        },
        [],
        target,
    );
}

export default useDrag;