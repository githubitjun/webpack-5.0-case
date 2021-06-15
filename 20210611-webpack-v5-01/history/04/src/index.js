/*
 * @Author: 九天
 * @Date: 2021-06-11 10:33:35
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-15 09:53:57
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\src\index.js
 */




// function getComponent() {
//   const element = document.createElement('div');
//   element.innerHTML = 'hello world'
//   element.onclick = function(){
//       // 使用 import 语法 可以实现懒加载  在这个代码执行的时候才会去加载这个文件
//       // webpackChunkName 设置 新 chunk 的名称
//       import( /* webpackChunkName: "my-chunk-name" */'lodash').then(({ default: _ }) => {
//         const element = document.createElement('div');
//         element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//         document.body.appendChild(element);
//       }).catch((error) => 'An error occurred while loading the component');
//    }
//    document.body.appendChild(element);
// }

// getComponent()

import _ from 'lodash';
// import Print from './print';
 function component() {
   const element = document.createElement('div');

  // lodash 是由当前 script 脚本 import 进来的
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  //  element.onclick = Print.bind(null, 'Hello webpack!');
   return element;
 }

 document.body.appendChild(component());

