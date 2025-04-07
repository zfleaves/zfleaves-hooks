/**
 * title: 基础用法
 * desc: 使用 useRafState 替代 useState，在动画场景下可以减少重绘次数。
 */

import { useRafState } from 'zfleaves-hooks';
import React, { useEffect } from 'react';

export default () => {
  const [state, setState] = useRafState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const onResize = () => {
      setState({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    };
    onResize();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div>
      <p>Try to resize the window </p>
      current: {JSON.stringify(state)}
    </div>
  );
};
