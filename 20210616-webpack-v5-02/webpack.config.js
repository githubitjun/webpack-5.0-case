/*
 * @Author: 九天
 * @Date: 2021-06-16 14:34:37
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-16 16:58:26
 * @Description: 
 * @FilePath: \20210611-webpack\20210616-webpack-v5-02\webpack.config.js
 */
const path =  require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:'development' , // Set 'mode' option to 'development' or 'production'  当为 production 环境时 输出的js 文件和 html 文件的代码会被压缩
    entry:'./src/index.js',// 入口
    // entry:{
    //     // 多入口 将entry 改写成了一个对象
    //     index:'./src/index.js',
    //     print:'./src/print.js'
    // },
    output:{
         // filename:'bundle.js',// 打包后的文件名
         // filename:'[name].bundle.js',// 多出口的写法
        filename:'[name].[contenthash].js',//  给文件创建出唯一的 hash 值
        path:path.resolve(__dirname,'dist'), // 打包的路径
        clean:true, // 清理 dist 文件夹
        publicPath:'/', // 为图片, 文件等外部资源指定一个自定义的公共路径 
        assetModuleFilename: 'images/[hash][ext][query]', // 将某些资源(图片)发送到指定目录
    },
    module:{
        rules:[
            {
                // 解析 css 的loader,loader 的执行顺序是, 从右往左, 从下往上
                // style-loader 是将css 添加在 html 文件的 <head></head> 中的
                // css-loader 是解析css, 所以要先执行 css-loader 再执行 style-loader 
                test:/\.css$/i,
                use:['style-loader','css-loader'],
            },
            {
                // 解析图片  现在的 v5 版本比起之前的 v4 版本的使用更加简单了, 不需要之前 下载url-loader 和 file-loader
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type:'asset/resource'
            },
            {
                // 解析 csv ,tsv 文件   // npm install --save-dev csv-loader xml-loader     
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
              },
              {
                // 解析 xml 文件
                test: /\.xml$/i,
                use: ['xml-loader'],
              },
        ]
    },
    devServer:{
         // npm install --save-dev webpack-dev-server  // 开启一个web 服务
        contentBase:'./dist',// 从什么位置查找文件  告诉服务器内容来源
        // compress:true, // 为每个静态文件开启 gzip compression：
        port:9000, // 指定服务器的端口号
        host:"192.168.31.189",
        hot:true, // 开启热更新修改代码后会自动更新 需要安装 npm install webpack-hot-middleware -D
    },
    plugins:[
        // 指定打包的时候的html 模板  // npm install --save-dev html-webpack-plugin
       
        new HtmlWebpackPlugin({
            title:"管理输出", // 打包后的 html 文件的 title, 但是当指定了 template 属性的时候就不会生效
            filename:'index.html',// 打包后的文件名
            template:'./index.html', // 指定 打包的模板
        })
    ],
    devtool:'inline-source-map', // 代码映射 可以准确的显示 代码出错控制台显示的准确文件 和 输出的行数 'inline-source-map' 不要使用在生产环境
    resolve:{
        // 使用了别名 https://webpack.docschina.org/configuration/resolve/#resolvealias
        // 意思就是将 src 用 '@' 符号来代替了
        alias:{
            '@':path.resolve(__dirname,'src/')
        }
    }
}