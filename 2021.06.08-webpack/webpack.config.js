// webpack 是node 写出来的  node 的写法
let path = require('path')



let HtmlWebpackPlugin = require('html-webpack-plugin');// 这个插件可以指定html模板

let MiniCssExtractPlugin = require('mini-css-extract-plugin');// 这个插件抽离 css 样式 将css 样式放在一个文件里面

let OptimizeCss = require('optimize-css-assets-webpack-plugin');// 压缩css
let UglifyjsPlugin = require('uglifyjs-webpack-plugin');//压缩js 
module.exports = {
    optimization: { // 优化项
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
        // [hash:8]给这个文件添加一个 hash 戳 避免缓存的问题, 并且显示位数为8位数 (这个是旧的语法会有警告)
        // [fullhash:8] 是新的语法
        filename: 'bundle.[fullhash:8].js', //打包后的文件名
        path: path.resolve(__dirname, 'dist'),// 打包后的路径  路径必须是一个绝对路径
        // publicPath:'http://www.baidu.com', // 这个会给每个 打包后的文件加上 基准路径 这样是加载不出来的  随便写了个地址
    },
    plugins: [ // 放所有webpack 插件的数组
        new HtmlWebpackPlugin({
            template: './src/index.html', // 指定模板路径
            filename: 'index.html',// 打包后的名称
            // minify: {
            //     removeAttributeQuotes: true,// 删除双引号
            //     collapseWhitespace: true,// 变成一行
            // },
            // minify: false,
            hash: true,// 会给这个文件生成hash戳 避免浏览器缓存的问题
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css',// 抽离的css 的文件名称
        })
    ],
    resolveLoader:{
        modules:['node_modules',path.resolve(__dirname,'loader')]
        // 别名
        // alias:{
        //     loader1:path.resolve(__dirname,'loader','loader1.js')
        // }
    },
    module: {
        // 模块 loader 的配置
        rules: [
            // loader 的顺序 pre + noraml + inline(行内) + post
            // 默认情况下 loader 的顺序是 从右往左 , 从下往上执行, 所以执行顺序是 3 2 1 
            // 但是可以通过 设置enforce 属性来改变 就变成了 1 2 3
             { 
                // 自定义loader 写法二   
                test:/\.js$/,
                use:'loader1',
                enforce:'pre',
            },
            {
                
                test:/\.js$/,
                use:'loader2'
            },
            {
                
                test:/\.js$/,
                use:'loader3',
                enforce:'post',
            },
            // {
            //       // 自定义loader 写法一    
            //     test:/\.js$/,
            //     use:path.resolve(__dirname,'loader','loader1.js')
            // },
            {
                // html中直接使用img标签src加载图片的话，因为没有被依赖，图片将不会被打包。
                test: /\.(htm|html)$/i,
                // loader: 'html-withimg-loader'
                use: [
                        {
                            loader: 'html-withimg-loader',
                        }
                ]
            },
            {
                // 解析图片
                test: /\.(png|jpg|gif)$/,
                use: [
                        {
                            loader: 'url-loader',
                            options: {
                                esModule: false,
                                outputPath: 'assets', // 设置打包的图片的位置
                                // limit: 5 * 1024, // 当图片小于这么的时候 会打包成 base64
                                limit:1, //当设置为1 的时候就是正常产出
                                // publicPath:'http://www.baidu.com', // 单独给图片加上这个指定的 基准路径 同样可以给css js 都加上, 这样就可以实现不同文件的 cdn 加载,优化项
                            },
                        }
                ]
            },
            // {
            //     // 将这个变成一个全局变量 
            //     test:require.resolve('jquery'),
            //     use:'expose-loader?$'
            // },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader', // 用  babel-loader 需要把 es6 转换成es5
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                                ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                                ["@babel/plugin-proposal-private-methods", { "loose": true }]
                            ]

                        }
                    }
                ]
            },

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