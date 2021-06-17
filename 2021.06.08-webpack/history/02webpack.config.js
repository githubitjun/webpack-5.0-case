// webpack 是node 写出来的  node 的写法
let path = require('path')



let HtmlWebpackPlugin = require('html-webpack-plugin');// 这个插件可以指定html模板

let MiniCssExtractPlugin = require('mini-css-extract-plugin');// 这个插件抽离 css 样式 将css 样式放在一个文件里面

let OptimizeCss = require('optimize-css-assets-webpack-plugin')
let UglifyjsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
    optimization:{ // 优化项
        minimizer :[
            new UglifyjsPlugin({
                cache:true,// 是否使用缓存
                parallel:true,// 是否是并发打包的
                sourceMap:true,// 源码映射 方便调试
            }),
            new OptimizeCss()
        ]
    },
    devServer: { //  开发服务器的配置
        port: 3000,//指定端口
        progress: true,//显示进度条
        contentBase: './dist',
        compress: true,// 启动压缩
    },
    mode: 'development',// 模式 默认两种 production(会压缩js文件)   (development 开发模式能看到没有压缩的代码)
    entry: './src/index.js', // 入口
    output: {
        // [hash:8]给这个文件添加一个 hash 戳 避免缓存的问题, 并且显示位数为8位数
        filename: 'bundle.[hash:8].js', //打包后的文件名
        path: path.resolve(__dirname, 'dist'),// 打包后的路径  路径必须是一个绝对路径
    },
    plugins: [ // 放所有webpack 插件的数组
        new HtmlWebpackPlugin({
            template: './src/index.html', // 指定模板路径
            filename: 'index.html',// 打包后的名称
            minify: {
                removeAttributeQuotes: true,// 删除双引号
                collapseWhitespace: true,// 变成一行
            },
            hash: true,// 会给这个文件生成hash戳 避免浏览器缓存的问题
        }),
        new MiniCssExtractPlugin({
            filename:'main.css',// 抽离的css 的文件名称
        })
    ],

    module: {
        // 模块 loader 的配置
        rules: [
            // 规则 css-loader 解析 @import 这种语法的
            // style-loader 他是把css 插入到head 的标签中
            // loader 的特点: 希望单一
            // loader 的顺序 默认是从 右向左执行, 从下向上执行
            // loader 还可以写成对象的形式
            {
                test: /\.css$/, use: [
                     MiniCssExtractPlugin.loader, // 使用抽离好的css 文件
                    'css-loader',
                    'postcss-loader'
                ]
            },
            // 处理 less 文件  需要安装 less 和 less-loader
            {
                test: /\.less$/, use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader',// 把 less 解析成 css
                ]
            }
        ],
       
    },
}