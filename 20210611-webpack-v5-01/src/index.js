/*
 * @Author: 九天
 * @Date: 2021-06-11 10:33:35
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-11 18:04:16
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\src\index.js
 */




function getComponent() {
  const element = document.createElement('div');
  element.innerHTML = 'hello world'
  element.onclick = function(){
      // 使用 import 语法 可以实现懒加载  在这个代码执行的时候才会去加载这个文件
      // webpackChunkName 设置 新 chunk 的名称
      import( /* webpackChunkName: "my-chunk-name" */'lodash').then(({ default: _ }) => {
        const element = document.createElement('div');
        element.innerHTML = _.join(['Hello', 'webpack'], ' ');
        document.body.appendChild(element);
      }).catch((error) => 'An error occurred while loading the component');
   }
   document.body.appendChild(element);
}

getComponent()



