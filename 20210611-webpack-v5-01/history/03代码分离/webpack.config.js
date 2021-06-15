/*
 * @Author: 九天
 * @Date: 2021-06-11 10:45:12
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-11 16:21:48
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\webpack.config.js
 */
const path = require('path')


const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:'development', // Set 'mode' option to 'development' or 'production'
    // entry:'./src/index.js',// 入口
    entry:{
        // 多入口 将entry 改写成了一个对象
        // index:'./src/index.js',
        // print:'./src/print.js',
        index:{
            import:'./src/index.js',
            dependOn:'shared', // 这样可以在多个 chunk 之间共享模块：
        },
        print:{
            import:'./src/print.js',
            dependOn:'shared', // 这样可以在多个 chunk 之间共享模块： 还需设置 optimization.runtimeChunk: 'single'
        }, 
        shared: 'lodash', // 实现多个模块共享
    },
    output:{
        // filename:'bundle.js',// 打包后的文件名   
        // filename:'[name].bundle.js',// 多出口的写法
        filename:'[name].[contenthash].js',//  给文件创建出唯一的 hash 值
        path:path.resolve(__dirname,'dist'),
        clean: true, // 清理 dist 文件夹
        publicPath:'/',//
    },
    optimization: {
        // runtimeChunk: 'single',
        //  可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。
        splitChunks:{
            chunks:'all'
        },
    },
    devServer:{
        // npm install --save-dev webpack-dev-server  // 开启一个web 服务
        contentBase:'./dist',// 从什么位置查找文件  告诉服务器内容的来源。仅在需要提供静态文件时才进行配置。
        // compress: true, //为每个静态文件开启 gzip compression：
        port:9000,// 指定服务的端口号
        host:"192.168.31.189", 
        hot:true, // 开启热更新修改代码后会自动更新  需要安装 npm install webpack-hot-middleware -D
    },
    plugins:[
        // 指定打包的时候html模板
        new HtmlWebpackPlugin({
            title:'管理输出', // 打包后的 html 文件的 title, 但是当指定了 template 属性的时候就不会生效
            filename:'index.html', // 打包后的文件名
            template:'./index.html', // 指定 打包的模板
        })
    ],
    devtool: 'inline-source-map', // 代码映射 可以准确的显示 代码出错控制台显示的准确文件和 输出的行数 'inline-source-map' 不要使用在生产环境
}
   