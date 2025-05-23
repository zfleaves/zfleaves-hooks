/**
 * title: 动态加载样式
 * desc: 加载 css 文件，例如引入 [bootstrap-badge.css](/useExternal/bootstrap-badge.css)
 */

import { useExternal } from 'zfleaves-hooks';
import React, { useState } from 'react';

export default () => {
  const [path, setPath] = useState('/useExternal/bootstrap-badge.css');

  const status = useExternal(path);

  return (
    <>
      <p>
        Status: <b>{status}</b>
      </p>
      <div className="bd-example" style={{ wordBreak: 'break-word' }}>
        <span className="badge badge-pill badge-primary">Primary</span>
        <span className="badge badge-pill badge-secondary">Secondary</span>
        <span className="badge badge-pill badge-success">Success</span>
        <span className="badge badge-pill badge-danger">Danger</span>
        <span className="badge badge-pill badge-warning">Warning</span>
        <span className="badge badge-pill badge-info">Info</span>
        <span className="badge badge-pill badge-light">Light</span>
        <span className="badge badge-pill badge-dark">Dark</span>
      </div>
      <br />
      <button type="button" style={{ marginRight: 8 }} onClick={() => setPath('')}>
        unload
      </button>
      <button
        type="button"
        style={{ marginRight: 8 }}
        onClick={() => setPath('/useExternal/bootstrap-badge.css')}
      >
        load
      </button>
    </>
  );
};
