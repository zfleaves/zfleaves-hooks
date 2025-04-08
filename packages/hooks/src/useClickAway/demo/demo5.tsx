/**
 * title: 支持传入多个事件名称
 * desc: 设置了多个事件，你可以试试用鼠标左键或者右键。
 */

import React, { useState, useRef } from 'react';
import { useClickAway } from 'zfleaves-hooks';

export default () => {
  const [counter, setCounter] = useState(0);
  const ref = useRef(null);
  useClickAway(
    () => {
      setCounter((s) => s + 1);
    },
    ref,
    ['click', 'contextmenu'],
  );

  return (
    <div>
      <button type="button" ref={ref}>
        box
      </button>
      <p>counter: {counter}</p>
    </div>
  );
};
