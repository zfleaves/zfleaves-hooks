/**
 * title: 基础用法
 * desc: 加载 js 文件，例如引入 [test-external-script.js](/useExternal/test-external-script.js)
 */

import React from 'react';
import { useExternal } from 'zfleaves-hooks';

export default () => {
  const status = useExternal('/useExternal/test-external-script.js', {
    js: {
      async: true,
    },
  });

  return (
    <>
      <p>
        Status: <b>{status}</b>
      </p>
      <p>
        Response: <i>{status === 'ready' ? window.TEST_SCRIPT?.start() : '-'}</i>
      </p>
    </>
  );
};
