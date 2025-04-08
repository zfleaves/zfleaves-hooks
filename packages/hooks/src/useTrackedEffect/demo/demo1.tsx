/**
 * title: 基础用法
 * desc: 查看每次 effect 执行时发生变化的依赖项
 */

import { message } from 'antd';
import React, { useState } from 'react';
import { useTrackedEffect } from 'zfleaves-hooks';

export default () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  useTrackedEffect(
    (changes) => {
      console.log('Index of changed dependencies: ', changes);
      if (changes?.includes(0)) {
        message.info('第一个依赖项发生了变化');
      }
      if (changes?.includes(1)) {
        message.info('第二个依赖项发生了变化');
      }
    },
    [count, count2],
  );

  return (
    <div>
      <p>Please open the browser console to view the output!</p>
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount((c) => c + 1)}>count + 1</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <p>Count2: {count2}</p>
        <button onClick={() => setCount2((c) => c + 1)}>count + 1</button>
      </div>
    </div>
  );
};
