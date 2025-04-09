/**
 * title: 基础用法
 * desc: 每1000ms，执行一次
 */

import React, { useState } from 'react';
import { useRafInterval } from 'zfleaves-hooks';

export default () => {
  const [count, setCount] = useState(0);

  useRafInterval(() => {
    setCount(count + 1);
  }, 1000);

  return <div>count: {count}</div>;
};
