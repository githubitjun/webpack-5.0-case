/*
 * @Author: 九天
 * @Date: 2021-06-17 09:02:08
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-17 17:12:33
 * @Description: 
 * @FilePath: \2021.06.08-webpack\src\index.js
 */


// console.log('hello zf')
// const a = require('./a.js')
// require('./index.css');
// require('./index1.less');

// let fn = ()=>{
//     console.log('箭头函数')
// }
// fn();

// // @log 类的装饰器
// @log
// class A {
//      constructor(){
//          this.a = 1
//      }
    
// }
// function log(target){
//     console.log(target)
// }

// let b = new A()
// console.log(b.a);

// import $ from 'expose-loader?$!jquery';
// // console.log($)
// console.log(window.$);


require('./index.css');
import logo from './01.jpg'
let image = new Image()
image.src =logo 
document.body.appendChild(image)

import Index from './index.vue'