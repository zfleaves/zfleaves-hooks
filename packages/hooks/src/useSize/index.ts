import ResizeObserver from 'resize-observer-polyfill';
import useRafState from '../useRafState';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useIsomorphicLayoutEffectWithTarget from '../utils/useIsomorphicLayoutEffectWithTarget';

type Size = { width: number; height: number };

/**
 * 对一个 DOM 节点进行监听，返回其尺寸信息
 * @param target  DOM 节点
 * @returns 尺寸信息
 */ 
function useSize(target: BasicTarget): Size | undefined {
    const [state, setState] = useRafState<Size | undefined>(() => {
        const el = getTargetElement(target);
        // @ts-ignore
        return el ? { width: el.clientWidth, height: el.clientHeight } : undefined;
    });

    useIsomorphicLayoutEffectWithTarget(
        () => {
            const el = getTargetElement(target);

            if (!el) {
                return;
            }
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { clientWidth, clientHeight } = entry.target;
                    setState({ width: clientWidth, height: clientHeight });
                }
            })
            // @ts-ignore
            resizeObserver.observe(el);
            return () => {
                resizeObserver.disconnect();
            }
        },
        [],
        target,
    )

    return state;
}

export default useSize;

