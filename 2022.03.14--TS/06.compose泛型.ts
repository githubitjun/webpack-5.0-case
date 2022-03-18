export { }
/**
 * 组合泛型
 */

// 泛型类型别名
type Cary<T> = { list: [T] } | [T];
let c1: Cary<string> = { list: ['1'] };
let c2: Cary<number> = [1];

/**
 * 泛型接口 VS 泛型类型别名
 * 1.接口创建了一个新的名字,它可以在其他任意地方被调用. 而类型别名并不创建新的名字
 * 2.类型别名不能被extends 和 implements, 这时我们应该尽量使用接口代替类型别名
 * 3.当我们需要使用联合类型或者元组类型的时候,类型别名更加合适
 * 4.能用Interface接口实现的就不要用type别名来实现
 */


namespace A {
    type Func<T extends any[], R > = (...a: T) => R;
    function compose(): <R>(a: R) => R
    function compose<F extends Function>(f:F) : F;
    function compose<A, T extends any[],R>(
        f1:(a:A)=>R,
        f2:Func<T,A>
    ):Func<T,R>
    function compose<A,B,T extends any[],R>(
        f1:(b:B)=> R,
        f2:(a:A)=>B,
        f3:Func<T,A>
    ):Func<T,R>;
    function compose<A,B,C,T extends any[],R>(
        f1:(c:C)=>R,
        f2:(b:B)=>C,
        f3:(a:A)=>B,
        f4:Func<T,A>
    ):Func<T,R>;
    function compose<R>(
        f1:(a:any)=>R,
        ...funcs:Function[]
    ):(...arg:any[])=>R;
    function compose<R>(...funcs:Function[]):(...args:any[])=>R;
    function compose(...funcs: Function[]) {
        if (funcs.length === 0) {
            return <T>(arg: T): T => arg
        }
        if (funcs.length === 1) {
            return funcs[0]
        }
        return funcs.reduce((a, b) => (...args: any) => a(b(...args)))
    }
} 