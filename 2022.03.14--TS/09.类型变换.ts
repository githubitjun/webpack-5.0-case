export { }
interface Person1 {
    name: string,
    age: 18,
    job: {
        name: string
    }
}
let pJon: Person1['job'] = {
    name: '张三'
}
// console.log(pJon)


// 混入
function mixin<T, U>(one: T, two: U) {
    const result = <(T & U)>{};
    for (const key in one) {
        (<T>result)[key] = one[key]
    }
    for (const key in two) {
        (<U>result)[key] = two[key]
    }
    return result;
}
const x = mixin({ name: '张三' }, { 'age': 11 })
