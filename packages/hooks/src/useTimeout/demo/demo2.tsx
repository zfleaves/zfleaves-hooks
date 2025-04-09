/**
 * title: 进阶使用
 * desc: 动态修改 delay 以实现定时器间隔变化与暂停。
 */

import React, { useState } from 'react';
import { useTimeout } from 'zfleaves-hooks';

export default () => {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState<number | undefined>(1000);

  const clear = useTimeout(() => {
    setCount(count + 1);
  }, delay);

  return (
    <div>
      <p> count: {count} </p>
      <p style={{ marginTop: 16 }}> Delay: {delay} </p>
      <button onClick={() => setDelay((t) => (!!t ? t + 1000 : 1000))} style={{ marginRight: 8 }}>
        Delay + 1000
      </button>
      <button
        style={{ marginRight: 8 }}
        onClick={() => {
          setDelay(1000);
        }}
      >
        reset Delay
      </button>
      <button onClick={clear}>clear</button>
    </div>
  );
};
