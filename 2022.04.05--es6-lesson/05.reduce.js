// reduce 收敛函数 可以把一个数组转化为其他格式


Array.prototype.reduce = function (callback, pre) {
    for (let i = 0; i < this.length; i++) {
        if (!pre) {
            pre = callback(this[i], this[i + 1], i + 1, this);
            i++; // 下次开始从第三个数开始
        } else {
            pre = callback(pre, this[i], i, this)
        }
    }
    return pre
}


// reduce 方法使用的前提必须是 数组不能为空 如果只有一个值则返回当前值
let r = ([2]).reduce((pre, cur) => {
    // console.log(pre, cur);
    return pre + cur
}, 1)
// console.log(r);

let c = ([1, 2, 3, 4, 5]).reduce((pre, cur) => {
    return pre + cur
}, 1)
// console.log(c); // 16


// compose 面试问 用reduce 实现 compose 组合函数 
function sun(a, b) {
    return a + b
}
function len(str) {
    return str.length;
}
function addPrefix(str) {
    return '$' + str;
}
// let r1 = addPrefix(len(sun('a','b')));

/* // 使用的 reduceRight
const compose = (...fns) => {
    return function(...args){
        let lastFn = fns.pop();
        return fns.reduceRight((prev,current)=>{
            return current(prev)
        },lastFn(...args))
    }
} */

// 使用 reduce
/**
 * 代码分析 一开始 a: addPrefix  b:len
 * 返回以后的a 就是 function (...args) {  return addPrefix(len(...args))  } ; b就是: sun
 * 最后执行返回的函数就是 function (...args) {
            return (function (...args) {  return addPrefix(len(...args))  })(sun(...args))
        }
 */
const compose = (...fns) => {
    return fns.reduce((a, b) => {
        return function (...args) {
            return a(b(...args))
        }
    })
}
let final = compose(addPrefix, len, sun);
const f = final('a', 'b');
console.log(f);

