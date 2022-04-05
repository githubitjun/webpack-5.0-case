import { hasChanged, isArray, isObject } from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOpType, TriggerOrTypes } from "./operators";
import { reactive } from "./reactive";

export function ref(value) {
    // 将一个普通类型 变成一个对象,  可以是对象 但是一般情况下是对象直接用reactive 更合理
    return createRef(value);
}

// ref 和 reactive 的区别  reactive内部采用proxy ref中内部使用的是 defineProperty

export function shallowRef(value) {
    return createRef(value, true);
}

// 后续看vue的源码基本上使用的都是高阶函数 做了类似柯里化的功能;

const convert = (val) => isObject(val) ? reactive(val) : val;
class RefImpl {
    public _value; // 标识声明了一个_value 属性 但是没有赋值
    public __v_isRef = true; // 产生的实例会被添加 __v_isRef 表示是一个ref属性
    constructor(public rawValue, public shallow) { // 参数中前面增加修饰符 标识此属性放到了实例上
        this._value = shallow ? rawValue : convert(rawValue); // 如果是深度的 需要把里面的都变成响应式的 直接使用 reactive
    }
    // 类的属性访问器
    get value() {
        // 收集依赖 收集effect 
        track(this, TrackOpType.GET, 'value');
        return this._value;
    }
    set value(newValue) {
        if (hasChanged(newValue, this.rawValue)) { // 判断老值和新值是否有变化
            this.rawValue = newValue;
            this._value = this.shallow ? newValue : convert(newValue);
            trigger(this, TriggerOrTypes.SET, 'value', newValue);
        }
    }

}

function createRef(rawValue, shallow = false) {
    return new RefImpl(rawValue, shallow)
}

class ObjectRefImpl {
    public __v_isRef = true;
    constructor(public target, public key) {

    }
    get value() {
        return this.target[this.key]
    }
    set value(newValue) {
        this.target[this.key] = newValue;
    }
}


// 可以讲一个对象的值转化成ref 类型
export function toRef(target, key) {
    return new ObjectRefImpl(target, key);
}

// 包装整个对象
export function toRefs(object) {
    // object 可能传递的是一个数组或者对象
    const ret = isArray(object) ? new Array(object.length) : {};
    for (let key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}