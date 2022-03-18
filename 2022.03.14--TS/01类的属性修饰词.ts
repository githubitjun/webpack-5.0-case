export { }

class Father {
    public name: string; //public 公有的 自己 自己的子类  实例话的对象都能访问
    protected age: number; // protected 受保护的  自己和自己的子类能访问  实例化的对象不能访问 
    private  money: number; // private 私有的  只能自己能访问  在子类和实例化的对象不能访问
    static describe:string = '这是Father'; // static静态属性 可以被子类继承
    constructor(name: string, age: number, money: number) {
        this.name = name;
        this.age = age;
        this.money = money;
    }
    getName(): string {
        console.log(this,this.money);
        return this.name;
    }
    setName(name:string) : void{
        this.name = name;
    }
}

class Child extends Father {
    constructor(name:string,age:number, money: number){
        super(name,age, money);
    }
    desc(){
        console.log(this.name,this.age);
    }
}

let father = new Father('父级',50,1000);
console.log(father.getName(),Father.describe);

let child = new Child('张三',18,500);
console.log(child.getName(),Child.describe);