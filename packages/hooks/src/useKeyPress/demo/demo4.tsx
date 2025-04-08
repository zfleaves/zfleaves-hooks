/**
 * title: 进阶使用
 * desc: 支持接收一个返回 boolean 的回调函数，自己处理逻辑。
 */

import React, { useState } from 'react';
import { useKeyPress } from 'zfleaves-hooks';

export default () => {
  const [key, setKey] = useState<string>();
  const filterKey = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  useKeyPress(
    (event) => !filterKey.includes(event.key),
    (event) => {
      if (event.type === 'keyup') {
        setKey(event.key);
      }
    },
    {
      events: ['keydown', 'keyup'],
    },
  );

  return (
    <div>
      Pressing key except number key：<span style={{ color: '#f00' }}>{key}</span>
    </div>
  );
};
