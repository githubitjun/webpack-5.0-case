export { };
// 创建一个长度为length的数组, 里面的值用value 填充
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result
}
let c1: Array<string> = createArray<string>(3, '3');
// console.log(c1);

// 泛型类
class MyArray<T> {
    private list: T[] = [];
    add(value: T) {
        this.list.push(value)
    }
    getValue(): T {
        return this.list[0]
    }
}
let my1 = new MyArray<number>()
my1.add(0);
my1.add(1);
// console.log(my1.getValue());

//泛型与new 
function factory<T>(type: { new(): T }): T {
    return new type();
}
class Person { }
let f1: Person = factory<Person>(Person)
// console.log(f1);


// 泛型接口
interface CalcSun {
    <T>(a: T): T;
}
let ca1: CalcSun = function <T>(a: T): T {
    return a
}
// console.log(ca1<number>(12));

interface CalcSun1<T> {
    (a: T): T;
}
let ca2: CalcSun1<number> = function (a: number): number {
    return a
}
// console.log(ca2(13));

interface CalcSun2<T> {
    <U>(a: T, b: U): T;
}
let ca3: CalcSun2<number> = function <U>(a: number, b: U): number {
    // console.log(b);
    return a
}
// console.log(ca3<string>(1,'11'));

// 泛型可以传多个
function swap<A, B>(temp: [A, B]): [B, A] {
    return [temp[1], temp[0]]
}

// 默认泛型
interface Temp<T = string> {
    name: T
}
let t1: Temp = {
    name: "12"
}

// 泛型约束
/*
 function logger<T>(val:T) {
    console.log(val.length); // 这里会报错 不是所有类型都有length 属性
}
 */
interface LengthWise {
    length: number
}
// 
function logger<T extends LengthWise>(val: T) {
    console.log(val.length);
}
logger<Array<number>>([1, 1])
// logger<number[]>([1,1])
let obj = {
    length: 10,
}
// type Obj = {
//     length:number,
// };
type Obj = typeof obj;
/**
 * type Obj = typeof obj; 等价于  type Obj = {
                                                length:number,
                                                };
 */
logger<Obj>(obj)
