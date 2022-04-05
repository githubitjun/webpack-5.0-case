let s1 = Symbol('jw'); // 创建独一无二的类型
let s2 = Symbol('jw');
// console.log(s1 ===s2); // false

let obj = {
    name: 'zf',
    age: 13,
    [s1]: 'ok',
}
for (const key in obj) { //Symbol 属性默认是不能枚举的
//    console.log(obj[key]);
}

// console.log(Object.getOwnPropertySymbols(obj)); // 获取所有的symbol
// console.log(Object.keys(obj)); // 获取普通类型的key


let s3 = Symbol.for('jw');  // 声明全新的
let s4 = Symbol.for('jw'); // 把之前声明的拿过来用
// console.log(s3===s4); // true


// 元编程的能力 --> 改写语法的本身
let obj1 = {
    [Symbol.toStringTag]:'jw'
}
// console.log(Object.prototype.toString.call(obj1)); // [object jw]

// 隐式类型转换
let obj2 = {
    [Symbol.toPrimitive](type) {
        return '123'
    }
}
// console.log(obj2 + 1); // 1231


// 自己改变instanceof
let instance = {
    [Symbol.hasInstance](value){
        return 'name' in value;
    }
}
console.log({name:'张三'} instanceof instance); // true