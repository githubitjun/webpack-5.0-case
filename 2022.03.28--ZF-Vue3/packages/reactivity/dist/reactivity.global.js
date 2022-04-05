var VueReactivity = (function (exports) {
    'use strict';

    const isObject = (obj) => typeof obj === 'object' && typeof obj !== null;
    const extend = Object.assign;
    const isArray = Array.isArray;
    const isIntegerKey = (key) => parseInt(key) + '' === key;
    let hasOwnProperty = Object.prototype.hasOwnProperty;
    const hasOwn = (target, key) => hasOwnProperty.call(target, key);
    const hasChanged = (oldValue, value) => oldValue !== value;

    function effect(fn, options = {}) {
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
                }
                finally {
                    effectStack.pop();
                    activeEffect = effectStack[effectStack.length - 1];
                }
            }
        };
        effect.id = uid++; // 制作一个effect标识 用于区分effect
        effect._isEffect = true; // 用于标识这个响应式effect
        effect.raw = fn; // 保留effect对应的原函数
        effect.options = options; // 在effect保留用户的属性
        return effect;
    }
    // 让某个对象中的属性 收集当前他对应的 effect 函数
    const targetMap = new WeakMap();
    function track(target, type, key) {
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
            depsMap.set(key, (dep = new Set));
        }
        if (!dep.has(activeEffect)) {
            dep.add(activeEffect);
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
    function trigger(target, type, key, newValue, oldValue) {
        // 如果这个属性没有 收集过effect 那不需要任何操作
        const depsMap = targetMap.get(target);
        if (!depsMap)
            return;
        const effects = new Set(); // 这里对effect 去重了
        const add = (effectToAdd) => {
            if (effectToAdd) {
                effectToAdd.forEach(effect => effects.add(effect));
            }
        };
        // 要将所有的 要执行的effect 全部存到一个新的集合中 最终一起执行
        // 1.看修改的是不是数组的长度 因为改长度影响比较大
        if (key === 'length' && isArray(target)) {
            // 如果对应的长度 有依赖收集需要更新
            depsMap.forEach((dep, index) => {
                if (key === 'length' || key > newValue) { // 如果更改的长度小于收集的索引 那么这个索引也需要触发effect重新执行
                    add(dep);
                }
            });
        }
        else {
            // 可能是对象
            if (key !== undefined) { // 这里肯定是修改 不能是新增
                add(depsMap.get(key));
            }
            // 如果修改了数组中的 某一个索引 怎么办?
            switch (type) {
                case 0 /* ADD */:
                    if (isArray(target) && isIntegerKey(key)) {
                        add(depsMap.get('length'));
                    }
            }
        }
        // console.log('effects', effects);
        effects.forEach((effect) => effect());
    }

    // 实现 new Proxy(target,handler)
    const get = createGetter();
    const shallowGet = createGetter(false, true);
    const readonlyGet = createGetter(true);
    const shallowReadonlyGet = createGetter(true, true);
    const set = createSetter();
    const shallowSet = createSetter(true);
    const mutableHandlers = {
        get,
        set,
    };
    const shallowReactiveHandlers = {
        get: shallowGet,
        set: shallowSet,
    };
    let readonlyObj = {
        set: (target, key) => {
            console.warn(`set on key ${key}  falied`);
        }
    };
    const readonlyHandlers = extend({
        get: readonlyGet
    }, readonlyObj);
    const shallowReadonlyHandlers = extend({
        get: shallowReadonlyGet
    }, readonlyObj);
    // 是不是仅读的 仅读的属性set 时会报异常
    // 是不是深度的
    function createGetter(isReadonly = false, shallow = false) {
        return function get(target, key, receiver) {
            // proxy + Reflect
            // 后续Object 上的方法会迁移到 Reflect 
            // 以前的 target[key] = value 方式设置值 可能会失败 并不会报异常 也没有返回值标识
            // Reflect 方法具备返回值
            const res = Reflect.get(target, key, receiver);
            if (!isReadonly) {
                // 收集依赖 等会数据变化后更新对应的视图
                console.log('执行effect时会取值', '收集effect');
                track(target, 0 /* GET */, key);
            }
            if (shallow) {
                return res;
            }
            if (isObject(res)) {
                // vue2 是一上来就递归  vue3 是当取值的时候递归 vue3的代理模式是懒递归
                return isReadonly ? readonly(res) : reactive(res);
            }
            return res;
        };
    }
    function createSetter(isReadonly = false) {
        return function set(target, key, value, receiver) {
            const oldValue = target[key]; // 获取老的值
            // isArray(target) && isIntegerKey(key) 判断是数组 并且改了下标的值 
            // 然后判断 修改的下标的值比 数据的长度小 那么就是修改
            // 最后 判断新老值是否相等 是相等就是修改
            let hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
            const result = Reflect.set(target, key, value, receiver); // target[key] = value
            if (!hadKey) {
                // 新增
                trigger(target, 0 /* ADD */, key, value);
                // console.log('新增');
            }
            else if (hasChanged(oldValue, value)) {
                // 修改
                trigger(target, 1 /* SET */, key, value);
                // console.log('修改');
            }
            // 我们要区分是新增的 还是修改的 vue2 里无法监控更改索引 无法监控数组的长度的变化
            // 当数据更新时  通知对应属性的effect 重新执行
            return result;
        };
    }

    function reactive(target) {
        return createReactiveObject(target, false, mutableHandlers);
    }
    function shallowReactive(target) {
        return createReactiveObject(target, false, shallowReactiveHandlers);
    }
    function readonly(target) {
        return createReactiveObject(target, true, readonlyHandlers);
    }
    function shallowReadonly(target) {
        return createReactiveObject(target, true, shallowReadonlyHandlers);
    }
    const reactiveMap = new WeakMap(); // 会自动的垃圾回收 不会造成内存泄漏 存储的key 只能是对象
    const readonlyMap = new WeakMap();
    function createReactiveObject(target, isReadonly, baseHandlers) {
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
        proxyMap.set(target, proxy); // 将要代理的对象和对应代理的结果缓存起来 
        return proxy;
    }

    function ref(value) {
        // 将一个普通类型 变成一个对象,  可以是对象 但是一般情况下是对象直接用reactive 更合理
        return createRef(value);
    }
    // ref 和 reactive 的区别  reactive内部采用proxy ref中内部使用的是 defineProperty
    function shallowRef(value) {
        return createRef(value, true);
    }
    // 后续看vue的源码基本上使用的都是高阶函数 做了类似柯里化的功能;
    const convert = (val) => isObject(val) ? reactive(val) : val;
    class RefImpl {
        rawValue;
        shallow;
        _value; // 标识声明了一个_value 属性 但是没有赋值
        __v_isRef = true; // 产生的实例会被添加 __v_isRef 表示是一个ref属性
        constructor(rawValue, shallow) {
            this.rawValue = rawValue;
            this.shallow = shallow;
            this._value = shallow ? rawValue : convert(rawValue); // 如果是深度的 需要把里面的都变成响应式的 直接使用 reactive
        }
        // 类的属性访问器
        get value() {
            // 收集依赖 收集effect 
            track(this, 0 /* GET */, 'value');
            return this._value;
        }
        set value(newValue) {
            if (hasChanged(newValue, this.rawValue)) { // 判断老值和新值是否有变化
                this.rawValue = newValue;
                this._value = this.shallow ? newValue : convert(newValue);
                trigger(this, 1 /* SET */, 'value', newValue);
            }
        }
    }
    function createRef(rawValue, shallow = false) {
        return new RefImpl(rawValue, shallow);
    }
    class ObjectRefImpl {
        target;
        key;
        __v_isRef = true;
        constructor(target, key) {
            this.target = target;
            this.key = key;
        }
        get value() {
            return this.target[this.key];
        }
        set value(newValue) {
            this.target[this.key] = newValue;
        }
    }
    // 可以讲一个对象的值转化成ref 类型
    function toRef(target, key) {
        return new ObjectRefImpl(target, key);
    }
    // 包装整个对象
    function toRefs(object) {
        // object 可能传递的是一个数组或者对象
        const ret = isArray(object) ? new Array(object.length) : {};
        for (let key in object) {
            ret[key] = toRef(object, key);
        }
        return ret;
    }

    exports.effect = effect;
    exports.reactive = reactive;
    exports.readonly = readonly;
    exports.ref = ref;
    exports.shallowReactive = shallowReactive;
    exports.shallowReadonly = shallowReadonly;
    exports.shallowRef = shallowRef;
    exports.toRef = toRef;
    exports.toRefs = toRefs;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=reactivity.global.js.map
