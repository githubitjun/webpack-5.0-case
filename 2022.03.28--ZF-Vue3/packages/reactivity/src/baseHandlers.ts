// 实现 new Proxy(target,handler)

import { extend, hasChanged, hasOwn, isArray, isIntegerKey, isObject } from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOpType, TriggerOrTypes } from "./operators";
import { readonly, reactive } from './reactive'

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter(true);

export const mutableHandlers = {
    get,
    set,
};
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet,
};

let readonlyObj = {
    set: (target, key) => {
        console.warn(`set on key ${key}  falied`);

    }
}

export const readonlyHandlers = extend({
    get: readonlyGet
}, readonlyObj);
export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet
}, readonlyObj);


// 是不是仅读的 仅读的属性set 时会报异常
// 是不是深度的
function createGetter(isReadonly = false, shallow = false) {  // 拦截获取功能

    return function get(target, key, receiver) {
        // proxy + Reflect

        // 后续Object 上的方法会迁移到 Reflect 
        // 以前的 target[key] = value 方式设置值 可能会失败 并不会报异常 也没有返回值标识
        // Reflect 方法具备返回值


        const res = Reflect.get(target, key, receiver);

        if (!isReadonly) {
            // 收集依赖 等会数据变化后更新对应的视图
            console.log('执行effect时会取值', '收集effect');
            track(target, TrackOpType.GET, key)
        }
        if (shallow) {
            return res;

        }
        if (isObject(res)) {
            // vue2 是一上来就递归  vue3 是当取值的时候递归 vue3的代理模式是懒递归
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res
    }



}
function createSetter(isReadonly = false) { // 拦截设置功能
    return function set(target, key, value, receiver) {

        const oldValue = target[key]; // 获取老的值
        // isArray(target) && isIntegerKey(key) 判断是数组 并且改了下标的值 
        // 然后判断 修改的下标的值比 数据的长度小 那么就是修改
        // 最后 判断新老值是否相等 是相等就是修改
        let hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);

        const result = Reflect.set(target, key, value, receiver); // target[key] = value

        if (!hadKey) {
            // 新增
            trigger(target, TriggerOrTypes.ADD, key, value);
            // console.log('新增');

        } else if (hasChanged(oldValue, value)) {
            // 修改
            trigger(target, TriggerOrTypes.SET, key, value, oldValue);
            // console.log('修改');

        }

        // 我们要区分是新增的 还是修改的 vue2 里无法监控更改索引 无法监控数组的长度的变化

        // 当数据更新时  通知对应属性的effect 重新执行

        return result;
    }
}