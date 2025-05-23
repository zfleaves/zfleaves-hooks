type Listener = (data: any) => void;
const listeners: Record<string, Listener[]> = {};

const trigger = (key: string, data: any) => {
    if (listeners[key]) {
        listeners[key].forEach((item) => item(data));
    }
}

const subscribe = (key: string, listener: Listener) => {
    if (!listeners[key]) {
        listeners[key] = [];
    }

    listeners[key].push(listener);

     // 返回取消订阅的函数
    return function unsubscribe() {
        const index = listeners[key].indexOf(listener);
        if (index > -1) {
            listeners[key].splice(index, 1);
        }
    }
}

export { trigger, subscribe };