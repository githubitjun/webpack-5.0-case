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
// const x = mixin({ name: '张三' }, { 'age': 11 })

// 映射类型
interface Person6 {
    name: string;
    age: number;
    gender: 'male' | 'female';
}
// Partial 批量把一个接口中的属性全部变成可选的  type PPerson = Partial<Person6>
type PartialPerson = {
    [key in keyof Person6]?: Person6[key]
}
// Partial 的原理
/* type Partial<T> = {
    [key in keyof T]?: T[key]
} */
type PPerson = Partial<Person6>

/**
 * 条件类型
 */
namespace A {
    interface Fish {
        name1: string;
    }
    interface Water {
        name2: string;
    }
    interface Bird {
        name3: string;
    }
    interface Sky {
        name4: string;
    }
    type Condition<T> = T extends Fish ? Water : Sky; // 如果传进来的T是Fish的子类型 就返回 Water 否则就返回Sky
    let con: Condition<Fish> = { name2: '水' };

    // 条件类型的分发
    let con1: Condition<Fish | Bird> = { name2: '' }; // Fish | Bird 会得到 Water | Sky 两种的T 所以会可以填name2 或者name4
    let con2: Condition<Fish | Bird> = { name4: '' };
}
