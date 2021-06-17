/*
 * @Author: 九天
 * @Date: 2021-06-16 14:37:23
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-17 17:41:52
 * @Description: 
 * @FilePath: \20210616-webpack-v5-02\src\index.js
 */

// import './style.css'
import '@/style.css'
import '@/style1.css'



import dataJson from './data.json' 
console.log(dataJson);

// 默认情况下  webpack 是能够解析 json 文件的;  要导入 CSV、TSV 和 XML，你可以使用 csv-loader 和 xml-loader。
 //  让我们处理加载这三类文件： npm install --save-dev csv-loader xml-loader                                 

 import  Icon from './01.jpg'
 function component() {
    const element = document.createElement('div');
  
    // lodash（目前通过一个 script 引入）对于执行这一行是必需的
    // lodash 在当前 script 中使用 import 引入
    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.innerHTML = '你好 世界1';
    element.classList.add('hello');

    // 将图像添加到我们已经存在的 div 中。
    const myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);
    return element;
  }
  
  // document.body.appendChild(component());

import DataXml  from './data.xml'
console.log(DataXml)


let [a,b] = [1,2]
console.log(a,b);



// 渲染 vue 文件
import Vue from 'vue';
import Index from './index.vue'
var vm = new Vue({
    el: '#app',
    render: function (createElement) {
     // 引入的是运行时的Vue，所以需要用render导入返回的内容就会放在el控制的这个区域里
        return createElement(Index);
    }
    // 简写形式
    // render:c=>c(app)  
})
