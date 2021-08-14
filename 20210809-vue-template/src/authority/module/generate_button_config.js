/*
 * @Author: your name
 * @Date: 2021-06-03 16:37:28
 * @LastEditTime: 2021-06-04 20:49:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\authority\module\generate_button_config.js
 */
/**
 * 描述：权限按钮配置 generateButtonConfig
 */
import Store from '@/store';

const generateButtonConfig = (buttonArr, parentPath) => {
    const obj = {};
    buttonArr.forEach((item) => {
        obj[item.id] = {
            name: item.name,
            value: item.id,
            method: '',
            type: 'text',
            action: function (vm, fnName) {
                vm[fnName]();
            },
            // 权限拦截
            permit () {
                const permitResource = {...Store.getters.permitResource};
                return permitResource[parentPath] && permitResource[parentPath][this.value];
            },
        };
    });
    return obj;
};


export {
    generateButtonConfig,
};
