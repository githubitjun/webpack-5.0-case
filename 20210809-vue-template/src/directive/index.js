import {startDrag} from '@/utils/drag';
import debounce from 'throttle-debounce/debounce';
import Store from '@/store';

/**
 * 全局动态添加属性指令
 * @param {*} el :指定dom
 * @param {*} binding :绑定对象
 */
const bindingProp = function (el, binding) {
    if (!binding.value) { return; }
    Object.keys(binding.value).forEach((item) => {
        el.setAttribute(item, binding.value[item]);
    });
};


/** *
 * 下拉模糊搜索
 * @type {number}
 */
const remoteTime = 500;
export const filter = function (el, binding) {
    let debounceFn;
    if (el.getElementsByClassName('el-input__inner')) {
        const tag = el.getElementsByClassName('el-input__inner')[0];
        tag.oninput = (e) => {
            if (!debounceFn) {
                debounceFn = debounce(remoteTime, () => {
                    const keycode = 13;
                    e.target.pressKey(keycode);
                });
            }
            debounceFn();
        };
    }
};

/**
 * input限制
 */
const regNumber = {
    inserted (el, binding, vnode, oldVnode) {

        const {max, min, type = 'floor'} = binding.value;
        // 获取节点
        const regSumEl = el.querySelector('.el-input__inner');
        regSumEl.addEventListener('blur', (event) => {
            const {value} = event.target;
            const {exValue = ''} = event.target.dataset;
            const regExp = type === 'floor' ? /^(\d+|\d+\.(\d{1,2}))?$/ : /^(\d+)?$/;

            if (!value) {
                event.target.dataset.exValue = value;
            } else {
                if (!regExp.test(value)) {
                    setTimeout(() => {
                        vnode.data.model.callback(exValue);
                    }, 0);
                } else if (!empty(max) && value > max || !empty(min) && value < min) {
                    setTimeout(() => {
                        vnode.data.model.callback(exValue);
                    }, 0);
                } else {
                    event.target.dataset.exValue = value;
                }
            }
        });
    },
};

/**
 * input数量正则: 正整数
 */
let timeout = '';
const regNum = {
    inserted (el, binding, vnode) {
        // 获取节点
        const regNumEl = el.querySelector('.el-input__inner');

        regNumEl.onkeyup = function () {
            clearTimeout(timeout);
            // 获取value值
            const regNumVal = regNumEl.value;
            // 匹配正则
            timeout = setTimeout(() => {
                vnode.data.model.callback(regNumVal.replace(/[^\d]/g, ''));
            }, 50);
        };
    },
};

/**
 * 为el-dialog弹框增加拖拽功能
 * @param {*} el 指定dom
 * @param {*} binding 绑定对象
 * desc   只要用到了el-dialog的组件，都可以通过增加v-draggable属性变为可拖拽的弹框
 */
const draggable = (el, binding) => {
    // 绑定拖拽事件
    startDrag(el.querySelector('.el-dialog__header'), el.querySelector('.el-dialog'), binding.value);
};

export default {
    bindingProp,
    filter,
    regNumber,
    draggable,
    regNum,
};

