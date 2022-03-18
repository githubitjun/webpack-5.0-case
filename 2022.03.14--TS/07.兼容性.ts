export { }
/**
 * 兼容性
 */

// 接口的兼容性: 你要的我都有 只能多不能少

namespace A {
    // 基本数据的兼容性 或的类型越多 能兼容的类型越多
    let text: string | number;
    let str1: string = '张三';
    text = str1;

    let text2: {
        toString(): string;
    }
    text2 = str1;
}


namespace B {
    // 类的兼容性 要看结构是否相同  再看 你要的我都有就能赋值
    class Animal {  }
    class Bird extends Animal {name:string}
    let a:Animal;
    let b:Bird;
    a=b;
    // b=a;
}

namespace C {
    // 函数的兼容性
    // 比较参数
    type Func = (a:number,b:number) => void
    let sun:Func;
    // 少一个参数可以
    function f1 (a:number){}
    sun = f1;
    // 少两个参数也可以
    function f2 (){}
    sun = f2;
    // function f3 (a:number,b:number,c:number){}
    // sun = f3; // 多一个参数就不可以  多的没办法接收


    // 比较返回值
    type GetPerson = () => { name:string,age:number }
    let g1:GetPerson;
    function p1 (){
        return {name:'张三',age:10}
    }
    g1 = p1; // 返回值一样肯定可以
    function p2 (){
        return {name:'张三',age:10,gender:'男'}
    }
    g1 = p2; // 返回值多一个也可以 你需要的我都有
    function p3 (){
        return {name:'张三',}
    }
    // g1 = p3; // 少一个就不行 只能多不能少  可以理解为: 少了之后我需要用的那个变量就缺失了会报错所以不行
}