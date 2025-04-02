import { useRef } from 'react';

function useLatest<T>(value: T) {
    // 使用useRef创建一个引用，初始值为传入的value
    const ref = useRef(value);

    // 将传入的value赋值给ref.current，确保ref.current始终是最新值
    ref.current = value;

    // 返回ref，外部可以通过ref.current获取最新的value
    return ref;
}

export default useLatest;