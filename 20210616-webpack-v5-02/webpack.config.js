/*
 * @Author: 九天
 * @Date: 2021-06-16 14:34:37
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-18 14:37:42
 * @Description: 
 * @FilePath: \20210611-webpack\20210616-webpack-v5-02\webpack.config.js
 */
const path =  require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');  // npm install --save-dev mini-css-extract-plugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // npm install css-minimizer-webpack-plugin --save-dev 将css 文件进行压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // npm install uglifyjs-webpack-plugin --save-dev  将 js 文件进行压缩


const { VueLoaderPlugin } = require('vue-loader'); // vue 结尾的文件 链接: https://vue-loader.vuejs.org/zh/guide/#vue-cli

/**
 * 解析 vue 结尾的文件步骤
 * 01. 下载 npm install -D vue-loader vue-template-compiler
 * 02. const { VueLoaderPlugin } = require('vue-loader');
* 03. 插件中使用 plugins: [
                // 请确保引入这个插件！
                new VueLoaderPlugin()
            ]
    04. {
        test: /\.vue$/,
        loader: 'vue-loader'
    }, // 而且这个 loader 要配置在 rules 数组的第一项里面, 踩坑: 我一开始 写在最 rules 数组的最后面,一直报错, 一直报vue-loader 找不到
 */


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
        // publicPath:'/', // 为图片, 文件等外部资源指定一个自定义的公共路径 
        assetModuleFilename: 'images/[hash][ext][query]', // 将某些资源(图片)发送到指定目录
    },
    plugins:[ // 放所有webpack 插件的数组
        // 指定打包的时候的html 模板  // npm install --save-dev html-webpack-plugin
        new HtmlWebpackPlugin({
            // title:"管理输出", // 打包后的 html 文件的 title, 但是当指定了 template 属性的时候就不会生效
            filename:'index.html',// 打包后的文件名
            template:'./index.html', // 指定 打包的模板
            hash:true, // 会给 文件生成一个 hash 戳, 避免浏览器缓存的问题
        }),
        // MiniCssExtractPlugin: 默认情况下的css 文件打包后的css 是直接插入到head 标签中的; 使用这个插件就能将 css 打包成一个css 文件,用link 的方式引入
        new MiniCssExtractPlugin({
            filename: 'main.css',// 抽离的css 的文件名称
        }),

        new VueLoaderPlugin(), // 解析 vue 结尾的文件
    ],
    module:{
        rules:[
            { 
                // vue-template-compiler 
                // 解析.vue 结尾的文件 这个loader 放在最前面, 放在这个数组rules 的最后的话会报错 
                test: /\.vue$/i, 
                loader: 'vue-loader'  
            },
            {
                // 解析 css 的loader,loader 的执行顺序是, 从右往左, 从下往上
                // style-loader 是将css 添加在 html 文件的 <head></head> 中的
                // css-loader 是解析css, 所以要先执行 css-loader 再执行 style-loader 
                test:/\.css$/i,
                use:[MiniCssExtractPlugin.loader,'css-loader'],
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
            {
                test: /\.html$/i,
                loader: 'html-loader',
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
   
    devtool:'inline-source-map', // 代码映射 可以准确的显示 代码出错控制台显示的准确文件 和 输出的行数 'inline-source-map' 不要使用在生产环境
    resolve:{
        // 使用了别名 https://webpack.docschina.org/configuration/resolve/#resolvealias
        // 意思就是将 src 用 '@' 符号来代替了
        alias:{
            '@':path.resolve(__dirname,'src/')
        }
    },

    optimization:{
        minimizer:[
            // 将js 进行压缩  此模块要求的最小版本为 Node v6.9.0 和 Webpack v4.0.0 版本, 现在用的 webpack5 的版本 所以会报警告
            new UglifyJsPlugin({ 
                parallel: true,// 并行化可以显著地加快构建速度，因此强烈推荐使用并行化。
                // 如果你构建时不想出现注释，可以按照以下配置将 uglifyOptions.output.comments 设置为 false
                uglifyOptions: {
                    output: {
                      comments: false, // 去掉注释
                    },
                },
                // cache:true,// 是否使用缓存
                // parallel:true,// 是否是并发打包的
                // sourceMap:true,// 源码映射 方便调试
            }),
            // 将css 文件压缩(会去掉css 注释) 默认情况下 在开发环境下不会压缩, 在 生产环境下会压缩   但是会引发另外一个问题就是js 不能自动压缩了 这个时候就需要配置 UglifyJsPlugin 插件压缩js 
            new CssMinimizerPlugin({
                parallel: true, // 并行化可以显著地加快构建速度，因此强烈推荐使用并行化。
            }), 
        ],
        // minimize:true, // 配置了这个属性在 开发环境下就会压缩
    }
}