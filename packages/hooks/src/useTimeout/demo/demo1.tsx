/**
 * title: 基础用法
 * desc: 3000ms 后执行一次
 */

import React, { useState } from 'react';
import { useTimeout } from 'zfleaves-hooks';

export default () => {
  const [state, setState] = useState(1);
  useTimeout(() => {
    setState(state + 1);
  }, 3000);

  return <div>{state}</div>;
};
