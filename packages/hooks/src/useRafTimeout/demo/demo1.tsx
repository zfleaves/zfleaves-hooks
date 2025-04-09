/**
 * title: 基础用法
 * desc: 在 2000ms 后执行。
 */

import React, { useState } from 'react';
import { useRafTimeout } from 'zfleaves-hooks';

export default () => {
  const [count, setCount] = useState(0);

  useRafTimeout(() => {
    setCount(count + 1);
  }, 2000);

  return <div>count: {count}</div>;
};
