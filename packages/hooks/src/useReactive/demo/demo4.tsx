/**
 * desc: useReactive 产生可操作的代理对象一直都是同一个引用，`useEffect` , `useMemo` ,`useCallback` ,`子组件属性传递` 等如果依赖的是这个代理对象是**不会**引起重新执行。
 */

import React, { useEffect, useState } from 'react';
import { useReactive } from 'zfleaves-hooks';

export default () => {
  const state = useReactive({ count: 0 });
  const [stateCount, setStateCount] = useState(0);

  const state2 = useReactive({ count: 0 });
  const [stateCount2, setStateCount2] = useState(0);

  // Depends on the object, because it is always the same reference, it will not be executed
  useEffect(() => {
    setStateCount(stateCount + 1);
  }, [state]); // state 引用永远不变 用 useCreation 创建的代理对象

  // Depends on the underlying data type, so as long as it changes, it will be re-executed
  useEffect(() => {
    setStateCount2(stateCount2 + 1);
  }, [state2.count]); // state2.count是具体值，每次变化都会引起重新执行

  return (
    <div>
      <button style={{ marginTop: 20 }} onClick={() => (state.count += 1)}>
        stateCount + 1
      </button>
      <p>stateCount:{stateCount}</p>

      <button style={{ marginTop: 20 }} onClick={() => (state2.count += 1)}>
        stateCount2 + 1
      </button>
      <p>stateCount2:{stateCount2}</p>
    </div>
  );
};
