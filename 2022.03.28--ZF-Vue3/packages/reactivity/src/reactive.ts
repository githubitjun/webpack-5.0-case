import { isObject } from "@vue/shared";
import { mutableHandlers, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'


export function reactive(target) {
    return createReactiveObject(target, false, mutableHandlers)
}

export function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers)
}
export function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers)
}


const reactiveMap = new WeakMap(); // 会自动的垃圾回收 不会造成内存泄漏 存储的key 只能是对象
const readonlyMap = new WeakMap();
export function createReactiveObject(target, isReadonly, baseHandlers) {
    // 如果目标不是对象,就没法拦截, reactive 这个api 只能拦截对象
    if (!isObject(target)) {
        return target;
    }
    // 如果某个对象已经被代理过了 就不要再次代理了 可能一个对象 被代理是深度  又被仅读代理了
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    const existProxy = proxyMap.get(target);
    if (existProxy) {
        return existProxy; // 如果已经被代理了 直接返回即可
    }

    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);// 将要代理的对象和对应代理的结果缓存起来 

    return proxy;
}