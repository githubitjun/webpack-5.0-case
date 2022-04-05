// ES6 后续新增的方法都会放在 Reflect 上
let s1 = Symbol('jw');

let obj = {
    name: 'zf',
    age: 13,
    [s1]: 'ok',
}
Reflect.ownKeys(obj).forEach(item=>{ // 获取所有的key 属性
    // console.log(item);
})


const fn = (a,b)=> {
    console.log('fn',a,b);
}
fn.apply = function () {
    console.log('apply');
}
// 调用函数本身的apply 方法如何调用 call的功能是让apply方法中的this指向fn,并让apply方法执行 fn.apply(null,[1,2])
// call 的作用: 1. 让函数执行 让apply执行
//              2. 改变apply 中的this指向 fn
// Function.prototype.apply.call(fn,null,[1,2]);

Reflect.apply(fn,null,[1,2])