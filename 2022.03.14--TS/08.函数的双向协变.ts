export { }
/**
 * 一切的一切都是为了类型的安全,为了使用的时候不报错
 * 返回值类型是协变的, 而参数类型是逆变的
 * 返回值类型可以传子类, 参数可以传父类
 * 参数逆变父类 返回值协变子类  搀你父,返鞋子
 * 自己的总结就是: 函数的参数只能少 不能多; 函数的返回值只能多不能少;
 */
namespace A {
    class Animal { }
    class Dog extends Animal {
        public name: string = 'Dog';
    }
    class BlackDog extends Dog {
        public age: number = 10;
    }
    class WitheDOg extends Dog {
        public home: string = '北京';
    }
    let animal: Animal;
    let dog: Dog;
    let blockDog: BlackDog;
    let witheDOg: WitheDOg;
    type Callback = (dog: Dog) => Dog;
    function exec(callback: Callback) {

    }
    /**
     * 四种情况
     * 1.参数传子类返回值子类
     * 2.参数是子类返回值父类
     * 3.参数是父类返回值父类
     * 4.参数是父类返回值子类
     * 自己的总结就是: 函数的参数只能少 不能多; 函数的返回值只能多不能少;
     */
    type ChildToChild = (blockDog: BlackDog) => BlackDog;
    let childToChild: ChildToChild;
    // exec(childToChild) //n
    type ChildToParent = (blockDog: BlackDog) => Animal;
    let childToParent: ChildToParent;
    // exec(childToParent) //n
    type ParentToParent = (blockDog: Animal) => Animal;
    let parentToParent: ParentToParent;
    // exec(parentToParent) //n
    type ParentToChild = (blockDog: Animal) => BlackDog;
    let parentToChild: ParentToChild;
    exec(parentToChild)
}
