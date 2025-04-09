// import isBrowser from '../../../utils/isBrowser';
// import isDocumentVisible from './isDocumentVisible';
// import isOnline from './isOnline';

// type Listener = () => void;

// const listeners: Listener[] = [];

// function subscribe(listener: Listener) {
//     listeners.push(listener);
//     return function unsubscribe() {
//         const index = listeners.indexOf(listener);
//         if (index > -1) {
//             listeners.splice(index, 1);
//         }
//     };
// }

// if (isBrowser) {
//     const revalidate = () => {
//         if (!isDocumentVisible() || !isOnline()) return;
//         for (let i = 0; i < listeners.length; i++) {
//             const listener = listeners[i];
//             listener();
//         }
//     };
//     window.addEventListener('visibilitychange', revalidate, false);
//     window.addEventListener('focus', revalidate, false);
// }

// export default subscribe;
import isBrowser from '../../../utils/isBrowser';
import isDocumentVisible from './isDocumentVisible';
import isOnline from './isOnline';

type Listener = () => void;

const listeners: Listener[] = [];

// 用于存储事件监听器的引用，以便能够移除它们
let visibilityChangeListener: (() => void) | null = null;
let focusListener: (() => void) | null = null;

function subscribe(listener: Listener) {
    listeners.push(listener);
    
    // 如果是第一个监听器，添加事件监听
    if (listeners.length === 1 && isBrowser) {
        const revalidate = () => {
            if (!isDocumentVisible() || !isOnline()) return;
            for (let i = 0; i < listeners.length; i++) {
                const listener = listeners[i];
                listener();
            }
        };
        
        visibilityChangeListener = revalidate;
        focusListener = revalidate;
        
        window.addEventListener('visibilitychange', visibilityChangeListener, false);
        window.addEventListener('focus', focusListener, false);
    }
    
    return function unsubscribe() {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
        
        // 如果是最后一个监听器，移除事件监听
        if (listeners.length === 0 && isBrowser && visibilityChangeListener && focusListener) {
            window.removeEventListener('visibilitychange', visibilityChangeListener, false);
            window.removeEventListener('focus', focusListener, false);
            
            visibilityChangeListener = null;
            focusListener = null;
        }
    };
}

export default subscribe;