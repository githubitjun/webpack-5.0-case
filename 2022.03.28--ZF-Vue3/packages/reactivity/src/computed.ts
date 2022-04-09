import { isFunction } from "@vue/shared";
import { effect, track, trigger } from "./effect";
import { TrackOpType, TriggerOrTypes } from "./operators";

class ComputedRefImpl {
    public _dirty = true; // 默认取值时不要用缓存
    public _value;
    public effect;
    constructor(public getter, public setter) { // ts 中 传进来的参数不会挂载到this上 要加上public;
        this.effect = effect(getter, {
            lazy: true, // 默认不执行
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(this,TriggerOrTypes.SET,'value')
                }
            }
        })

    }
    get value() { // 计算属性也要收集依赖

        if (this._dirty) {
            this._value = this.effect(); // 会将用户的返回值返回
            this._dirty = false;
        }
        track(this,TrackOpType.GET,'value');
        return this._value;
    }
    set value(newValue) {
        this.setter(newValue);
    }
}


// vue2 和 vue3 computed 原理是不一样的
export function computed(getterOrOptions) {
    let getter;
    let setter;

    // 先判断传递的参数是不是一个函数
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => {
            console.warn('computed value must be readonly');

        }
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter)
}