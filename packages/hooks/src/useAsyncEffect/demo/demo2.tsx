/**
 * title: 中断执行
 * desc: 通过 `yield` 语句可以增加一些检查点，如果发现当前 effect 已经被清理，会停止继续往下执行。
 */

import React, { useState } from 'react';
import { useAsyncEffect } from 'zfleaves-hooks';

function mockCheck(val: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val.length > 0);
    }, 1000);
  });
}

export default () => {
  const [value, setValue] = useState('');
  const [pass, setPass] = useState<boolean>();

  useAsyncEffect(
    async function* () {
      setPass(undefined);
      const result = await mockCheck(value);
      // yield 的作用主要体现在以下几个方面：
      // 异步生成器的特性：
      // 当使用 async function* 时，函数会返回一个异步生成器对象
      // 这个对象实现了 Symbol.asyncIterator 接口
      // 每次调用 next() 方法时，会执行到下一个 yield 语句或函数结束
      yield; // Check whether the effect is still valid, if it is has been cleaned up, stop at here.
      console.log('val: ', value);
      setPass(result);
    },
    [value],
  );

  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <p>
        {pass === null && 'Checking...'}
        {pass === false && 'Check failed.'}
        {pass === true && 'Check passed.'}
      </p>
    </div>
  );
};
