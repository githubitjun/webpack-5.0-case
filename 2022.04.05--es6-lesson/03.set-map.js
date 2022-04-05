// console.log(Object.prototype.toString.call(new Map())); // [object Map]
// console.log(Object.prototype.toString.call(new Set())); // [object Set]


// 数组  交集 并集 差集
let arr1 = [1,2,3,4];
let arr2 = [3,4,5,6,7];

// 并集
function union(arr1,arr2) {
    let s = new Set([...arr1,...arr2]); 
    return [...s]
}
// console.log(union(arr1,arr2));

// 交集
function intersection(arr1,arr2){
    let s1 = new Set(arr1);
    let s2 = new Set(arr2);
    return [...s1].filter(item => {
        return s2.has(item)
    })
}
// console.log(intersection(arr1,arr2));

// 差集 要看是谁对谁的差集
function difference(arr1,arr2){
    let s1 = new Set(arr1);
    let s2 = new Set(arr2);
    return [...s1].filter(item => {
        return !s2.has(item) 
    })
}
console.log(difference(arr1,arr2)); // [ 1, 2 ] 

// weakMap 弱引用类型  垃圾回收 "标记引用"
class MyTest{};
let my = new MyTest();// 对象
let mp = new WeakMap();
mp.set(my,1);
my = null; // ? 当你给一个变绿设置为null 的时候 不会马上回收, 会在合适的机会自己情况 map 引用的对象 不会被回收掉
            // WeakMap 引用的对象被置为null 时, 后续会被清空