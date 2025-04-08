/**
 * title: 自定义转换函数
 * desc: 只能输入数字的 input 组件
 */

import React from 'react';
import { useEventTarget } from 'zfleaves-hooks';

export default () => {
  const [value, { onChange, reset }] = useEventTarget({
    initialValue: '',
    // transformer: (val: string) => val.replace(/[^\d]/g, ''),
    transformer: (val: string) => {
      // 1. 移除所有非数字、非负号、非小数点的字符
      let filtered = val.replace(/[^-\d.]/g, '');
      
      // 2. 处理多个负号：只保留第一个负号
      const minusSigns = filtered.match(/-/g);
      if (minusSigns && minusSigns.length > 1) {
          filtered = filtered.replace(/-/g, '');
          filtered = '-' + filtered.replace(/-/g, '');
      }
      
      // 3. 处理多个小数点：只保留第一个小数点
      const decimalPoints = filtered.match(/\./g);
      if (decimalPoints && decimalPoints.length > 1) {
          const parts = filtered.split('.');
          filtered = parts[0] + '.' + parts.slice(1).join('');
      }
      
      return filtered;
  },
  });

  return (
    <div>
      <input
        value={value}
        onChange={onChange}
        style={{ width: 200, marginRight: 20 }}
        placeholder="Please type here"
      />
      <button type="button" onClick={reset}>
        reset
      </button>
    </div>
  );
};
