export { }
// 描述对象的形状
interface Speakable {
    name: string;
    speak(): void;
}
let speakMan: Speakable = {
    name: '张三',
    speak() { },
    age: 0
}

// 行为抽象
// 同名的接口可以写多个,类型会自动合并
interface Speakable {
    name: string,
    age: number,
}
interface SpeakableTwo {
    speak1(): void;
}
class speakManOne implements Speakable, SpeakableTwo {
    name: string;
    age: number;
    speak() { }
    speak1() { }
}

// 任意属性
interface Person1 {
    age: number;
    [value: string]: any; // 可以添加其他任意属性
}
let p1: Person1 = {
    age: 10,
    sex: '男',
}

// 接口的继承
interface Speakable3 extends Speakable {
    hello(num: number): void;
}
class SpeakMan3 implements Speakable3 {
    hello(num: number): void {
        throw new Error("Method not implemented.");
    }
    name: string;
    speak(): void {
        throw new Error("Method not implemented.");
    }
    age: number;

}

// 接口的属性只读
interface Speakable4 {
    readonly id: number; // readonly 属性只读
}
let s4: Speakable4 = {
    id: 20,
}

// 函数类型的接口
interface Discount {
    (price: number): number
}
const discount: Discount = (price: number): number => {
    return price * 2
}

// 可以索引接口  可以同时兼容 对数组和对象进行约束
interface User {
    [index: number]: string;
}
let user1: User = {
    1: '1',
    2: '2',
}
let user2: User = ['1', '2', '3'];




class Animal {
    constructor(public name: string) {
        this.name = name;
    }
}
// 描述构造函数类型 加上new关键字之后用来描述类的构造函数
interface WithNameClass {
    new(name: string): any
}
function createAnimal(clazz: WithNameClass, name: string) {
    return new clazz(name)
}

let a = createAnimal(Animal, 'zhangSan')
// console.log(a.name);


namespace A {
    class Component {
        static myName: string = '静态属性名称';
        muName: string = '实例属性名称';
    }
    let com = Component;
    let c: Component = new Component();
    // ts 中 冒号后面的是类型  等号后面的是值
    // ts 中的typeof 是获取类型  比如typeof Component 是获取它的类型
    let f: typeof Component = com;
    console.log(typeof Component);

}

namespace B {
    /**
     * 这描述的是一个函数类型
     */
    interface WithName1 {
        (name: string): any;// 这表示是一个函数
        age:number; // 这个age 表示的是 上面这个函数的一个属性
    }

    let t1: any = (name: string) => { }
    t1.age = 20;
    let t3:WithName1 = t1;
    /**
     * 这个描述的是一个对象 对象里面的属性a 是一个函数类型
     */
    interface WithName2 {
        a: (name: string) => any
    }
    let t2: WithName2 = {
        a: (name: string) => { }
    }
}


/**
 * 抽象类 VS 接口
 * 1.不同类之间共有的属性和方法,可以抽象成一个接口
 * 2.而抽象类是提供其他类继承的基类,抽象类不允许被实例化.抽象类中的抽象方法必须在子类中被实现
 * 3.抽象类本质是一个无法被实例化的类,其中能够实现方法和初始化属性,而接口仅能够用于描述,既不提供方法的实现,也不为属性进行初始化
 * 4.一个类可以继承一个类或者抽象类,但可以实现(implements)多 个接口
 * 5.抽象类也可以实现接口
 */