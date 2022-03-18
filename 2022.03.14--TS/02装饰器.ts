/**
 * 类的修饰器
 */

export { }

// namespace 命名空间
namespace a {
    function setNameEat(constructor: Function) {
        constructor.prototype.name = '张三';
        constructor.prototype.eat = function () {
            console.log(this.name);
        }
    }

    @setNameEat // 类的装饰器: 实际上就是一个函数
    class Person {
        name: string;
        eat: Function;
        constructor() {

        }
    }
    let p1: Person = new Person()
    // p1.name
    // p1.eat()
}



namespace b {
    function setNameEatPlant(name: string) {
        return function setNameEat(constructor: Function) {
            constructor.prototype.name = name;
            constructor.prototype.eat = function () {
                console.log(this.name);
            }
        }
    }

    @setNameEatPlant('张三工厂') // 装饰器工厂的写法 实际上就是setNameEatPlant 函数返回一个函数
    class Person {
        name: string;
        eat: Function;
        constructor() { }
    }
    let p1: Person = new Person()
    // p1.name
    // p1.eat()
}


namespace c {
    function setNameEat(constructor: Function) {
        return class {
            name: string;
            eat: Function = function () {
                console.log(this.name);

            };
            age: number;
            constructor() {

            }

        }
    }

    @setNameEat // 类的装饰器: 一个函数的返回值是一个class类  属性只能多不能少
    class Person {
        name: string;
        eat: Function;
        constructor() {

        }
    }
    let p1: Person = new Person()
    // p1.name
    // p1.eat()
}

/**
 * 属性装饰器
 * 装饰属性
 * 装饰方法
 */
namespace d {
    /**
     * 
     * @param target 如果装饰的是实例属性的话,target是构造函数的原型
     * @param propertyKey 
     */
    function upperCase(target: any, propertyKey: string) {
        let value = target[propertyKey]
        const getter = () => value;
        const setter = (newVal: string) => { value = newVal.toLocaleUpperCase() };
        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true,
            })
        }

    }
    // 如果装饰的是静态属性的话,target是构造函数本身
    function staticPropertyDecorator(target: any, propertyKey: string) {
        // console.log(target,propertyKey);
    }
    /**
     * 
     * @param target 如果装饰的是实例方法的话,target是构造函数的原型
     * @param propertyKey 
     * @param descriptor 属性描述器
     */
    function noEnumerable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = false;
    }
    // 装饰方法 会先执行这个函数
    function toNumber(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let oldMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            args = args.map(item => parseFloat(item))
            return oldMethod.apply(this, args)
        }
    }
    class Person {
        @upperCase
        public name: string = 'zhangSan'; // 实例属性
        @staticPropertyDecorator
        static age: number = 10; // 静态属性
        @noEnumerable
        getName() { // 实例方法
            console.log(this.name);
        }
        @toNumber
        sun(...args: any[]) {
            return args.reduce((acc: number, item: number) => acc + item, 0)
        }
    }
    let p1 = new Person();
    // console.log(p1.sun('1','2','3'));

}

// 参数装饰器
namespace e {
    // 手写一个IOC
    // 在IOC容器里大放异彩 Nest.js 大量用到了参数装饰器
    /*
    Nest 是一个用于构建高效，可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，
    内置并完全支持 TypeScript（但仍然允许开发人员使用纯 JavaScript 编写代码）并结合了 OOP（面向对象编程），
    FP（函数式编程）和 FRP（函数式响应编程）的元素。 */
    /**
     * 
     * @param target 静态成员就是构造函数  非静态成员就是构造函数原型 
     * @param methodName 方法的名称 
     * @param paramIndex 参数的索引
     */
    function addAge(target: any, methodName, paramIndex: number) {
        // 可以新增属性
        target.age = 20
    }
    class Person {
        public age: number;
        login(username: string, @addAge password: string) {
            console.log(this.age, username, password);

        }
    }
    let p1 = new Person();
    p1.login('1', '2')

}

// 装饰器的执行顺序
namespace f {   
    function ClassDecorator1(str:string){
        return function(target:Function){
            console.log(str);
        }
    }
    function ClassDecorator2(str:string){
        return function(target:Function){
            console.log(str);
        }
    }
    function PropertyDecorator(value:string){
        return function (target,key){
            console.log(value);
            
        }
    }
    function MethodDecorator(){
        return function (target,methodName){
            console.log("MethodDecorator",methodName);
        }
    }
    function ParamsDecorator(){
        return function(target,methodName,paramIndex){
            console.log("ParamsDecorator",methodName);
            
        }
    }
    @ClassDecorator1('ClassDecorator1')
    @ClassDecorator2('ClassDecorator2')
    class Person {
        @PropertyDecorator('name')
        name:string = '';
        @PropertyDecorator('age')
        age:number = 10;
        @MethodDecorator()
        hello(@ParamsDecorator() p1:string,@ParamsDecorator() p2:string){

        }
    }
    /**
     * 执行顺序的规律
     * 1.类装饰器是最后执行的,后写的类装饰器先执行
     * 2.方法和参数中的装饰器先执行参数
     * 3.属性装饰器 谁在前面先执行谁
     * 
     * 一般是由内往外执行 先内后外
     */
}