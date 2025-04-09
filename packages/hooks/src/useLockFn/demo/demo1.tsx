/**
 * title: 防止重复提交
 * desc: 在 `submit` 函数执行完成前，其余的点击动作都会被忽略。
 */

import { useLockFn } from 'zfleaves-hooks';
import { message } from 'antd';
import React, { useState } from 'react';
import { findAllByText } from '@testing-library/react';

function mockApiRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

export default () => {
  const [count, setCount] = useState(0);

  const fn = async () => {
    message.info('Start to submit');
    await mockApiRequest();
    setCount((val) => val + 1);
    message.success('Submit finished');
  }

  const submit = useLockFn(fn);

  return (
    <>
      <p>Submit count: {count}</p>
      <button onClick={submit}>Submit</button>
    </>
  );
};
