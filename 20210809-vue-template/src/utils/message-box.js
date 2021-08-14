import {Message, MessageBox, Notification} from 'element-ui';

export function message ({message, type, customClass, onClose, dangerouslyUseHTMLString}) {
    Message({
        message: message,
        type: type,
        customClass: customClass,
        duration: type == 'error' ? 60000 : 3000, // 错误状态下60s 关闭
        showClose: true,
        onClose: onClose,
        dangerouslyUseHTMLString: dangerouslyUseHTMLString,
    });
}

export function messageBox ({title, message, type, customClass, callback}) {
    MessageBox({
        title: title,
        message: message,
        type: type,
        customClass: customClass,
        callback: callback,
        showCancelButton: true,
        lockScroll: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
    });
}

export function notification ({title, message, type, customClass, onClose}) {
    Notification({
        title: title,
        message: message,
        type: type,
        customClass: customClass,
        onClose: onClose,
        duration: 3000,
        offset: 0,
    });
}
