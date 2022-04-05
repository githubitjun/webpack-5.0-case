import { isArray, isIntegerKey } from "@vue/shared";
import { TriggerOrTypes } from "./operators";

export function effect(fn, options: any = {}) {
    // 我需要让这个effect 变成响应的 efect 可以做到数据变化重新执行
    const effect = createReactiveEffect(fn, options);

    if (!options.lazy) { // 默认的effect 会先执行
        effect();
    }
    return effect;
}

let uid = 0;
let activeEffect; // 存储当前的 effect
const effectStack = []; // 不能存放重复的 effect
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) {
            try {
                effectStack.push(effect);
                activeEffect = effect;
                fn();
            } finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1]
            }
        }

    }
    effect.id = uid++; // 制作一个effect标识 用于区分effect
    effect._isEffect = true; // 用于标识这个响应式effect
    effect.raw = fn; // 保留effect对应的原函数
    effect.options = options; // 在effect保留用户的属性
    return effect;
}

// 让某个对象中的属性 收集当前他对应的 effect 函数
const targetMap = new WeakMap();
export function track(target, type, key) {
    // activeEffect; 当前正在运行的 effect
    if (activeEffect === undefined) { // 此属性不用依赖收集 因为没在effect 中使用
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, depsMap = new Map);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }
    console.log(targetMap);

}




// activeEffect 依赖收集就是收集effect -->  属性对应  effect 要存放的数据结构
// wekMap 存放对象属性 target => new Map 
// new Map 结构是=> key => Set



// effect(()=> {
//     state.age++; // 要防止这种造成死循环
// })

// 函数调用是一个栈结构
//  effect(()=>{ // effect1
//     state.name --> effect1
//     effect(()=>{//effect2
//         state.age --> effect2
//     })
//     state.address --> effect1
// })



// 找属性对应的effect 让其执行(这里值考虑了数组和对象)
export function trigger(target, type, key?, newValue?, oldValue?) {
    // 如果这个属性没有 收集过effect 那不需要任何操作
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const effects = new Set(); // 这里对effect 去重了
    const add = (effectToAdd) => {
        if (effectToAdd) {
            effectToAdd.forEach(effect => effects.add(effect))
        }
    }
    // 要将所有的 要执行的effect 全部存到一个新的集合中 最终一起执行

    // 1.看修改的是不是数组的长度 因为改长度影响比较大
    if (key === 'length' && isArray(target)) {
        // 如果对应的长度 有依赖收集需要更新
        depsMap.forEach((dep, index) => {
            if (key === 'length' || key > newValue) {// 如果更改的长度小于收集的索引 那么这个索引也需要触发effect重新执行
                add(dep);
            }
        })
    } else {
        // 可能是对象
        if (key !== undefined) { // 这里肯定是修改 不能是新增
            add(depsMap.get(key));
        }
        // 如果修改了数组中的 某一个索引 怎么办?
        switch (type) {
            case TriggerOrTypes.ADD:
                if (isArray(target) && isIntegerKey(key)) {
                    add(depsMap.get('length'));
                }
        }
    }

    // console.log('effects', effects);

    effects.forEach((effect: any) => effect());
}