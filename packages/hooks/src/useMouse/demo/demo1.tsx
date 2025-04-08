/**
 * title: 基础用法
 * desc: 获取鼠标位置。
 */

import { useMouse } from 'zfleaves-hooks';
import React from 'react';

export default () => {
  const mouse = useMouse();

  return (
    <div>
      <p>
        Client - x: {mouse.clientX}, y: {mouse.clientY}
      </p>
      <p>
        Page - x: {mouse.pageX}, y: {mouse.pageY}
      </p>
      <p>
        Screen - x: {mouse.screenX}, y: {mouse.screenY}
      </p>
    </div>
  );
};
