/*
 * @Author: 九天
 * @Date: 2021-06-11 10:33:35
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-11 14:02:59
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\src\index.js
 */
// import _ from 'lodash';
import '@/style.css'
import  Icon from './01.jpg'

import dataJson from './data.json' 
// 默认情况下  webpack 是能够解析 json 文件的;  要导入 CSV、TSV 和 XML，你可以使用 csv-loader 和 xml-loader。
 //  让我们处理加载这三类文件： npm install --save-dev csv-loader xml-loader                                 

import DataXml  from './data.xml'
console.log(DataXml)


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

    // element.appendChild(myIcon);

    return element;
  }
  
  document.body.appendChild(component());

console.log(dataJson);
