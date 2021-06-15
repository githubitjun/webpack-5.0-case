/*
 * @Author: 九天
 * @Date: 2021-06-11 10:33:35
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-11 16:04:27
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\src\index.js
 */

 import printMe from './print.js'


 console.log(_.join(['Another', 'module', 'index!'], ' '));
function component() {
    const element = document.createElement('div');
  
    // lodash（目前通过一个 script 引入）对于执行这一行是必需的
    // lodash 在当前 script 中使用 import 引入
    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.innerHTML = '你好 世界1';
    element.classList.add('hello');

    const btn = document.createElement('button');
    btn.innerHTML = 'click me'
    btn.onclick = printMe;

    element.appendChild(btn)

    return element;
  }
  
  document.body.appendChild(component());

