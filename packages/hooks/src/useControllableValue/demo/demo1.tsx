/**
 * title: 非受控组件
 * desc: 如果 props 中没有 value，则组件内部自己管理 state
 */
import React from 'react';
import { useControllableValue } from 'zfleaves-hooks';

export default (props: any) => {
  const [state, setState] = useControllableValue<string>(props, {
    defaultValue: '',
  });

  return (
    <>
      <input value={state} onChange={(e) => setState(e.target.value)} style={{ width: 300 }} />
      <button type="button" onClick={() => setState('')} style={{ marginLeft: 8 }}>
        Clear
      </button>
    </>
  );
};
