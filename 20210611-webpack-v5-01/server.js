/*
 * @Author: 九天
 * @Date: 2021-06-11 15:13:39
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-11 15:19:00
 * @Description: node 服务
 * @FilePath: \20210611-webpack-v5-01\server.js
 */
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config');
const compiler = webpack(config);

// 告知 express 使用 webpack-dev-middleware,
// 以及 webpack.config.js 配置文件作为基础配置
app.use(
    webpackDevMiddleware(compiler,{
        publicPath:config.output.publicPath
    })
)

// 开启服务器
app.listen(3000,function(){
    console.log('running node 服务起来了');
    
})