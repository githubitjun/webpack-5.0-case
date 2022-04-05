
// 把对象上的每个属性 都拷贝一下 深拷贝 递归对象去拷贝 利用栈

let obj = {
    name: {
        n: '张三',
        age: undefined,
    }
}

function deepClone(obj, hash = new WeakMap()) {
    if (obj == null) return obj;
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Date) return new Date(obj);
    // .....
    if (typeof obj !== 'object') return obj;
    // 对象类型 obj 数组 : [] 和 对象:{}

    if (hash.has(obj)) return hash.get(obj); // 返回上次拷贝的结果 不再递归了

    const copy = new obj.constructor;
    hash.set(obj, copy)
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepClone(obj[key],hash)
        }
    }
    return copy;
}
console.log(deepClone(obj));


// 这样在没有使用 WeakMap 的情况下回造成循环引用 一直循环造成栈溢出
var obj1 = {
    a: '1'
}
obj1.b = {}
obj1.b.a = obj1.b;
console.log(deepClone(obj1));