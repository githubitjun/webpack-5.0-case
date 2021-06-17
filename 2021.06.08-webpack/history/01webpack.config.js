// webpack 是node 写出来的  node 的写法
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin');// 这个插件可以指定html模板

let MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
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
            filename:'mian.css',// 抽离的css 的文件名称
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
                    {
                        loader: 'style-loader',
                        options: {
                            // 这种可以改变 插入的样式在 head 中的 位置 旧的语法 insertAt:'top', // 在新版本中已经不受支持了
                            
                            // insert: function insertAtTop(element) {
                            //     var parent = document.querySelector('head');
                            //     // eslint-disable-next-line no-underscore-dangle
                            //     var lastInsertedElement =
                            //       window._lastElementInsertedByStyleLoader;
                 
                            //     if (!lastInsertedElement) {
                            //       parent.insertBefore(element, parent.firstChild);
                            //     } else if (lastInsertedElement.nextSibling) {
                            //       parent.insertBefore(element, lastInsertedElement.nextSibling);
                            //     } else {
                            //       parent.appendChild(element);
                            //     }
                 
                            //     // eslint-disable-next-line no-underscore-dangle
                            //     window._lastElementInsertedByStyleLoader = element;
                            //   },
                        }
                    },
                    'css-loader']
            },
            // 处理 less 文件
            {
                test: /\.less$/, use: [
                    {
                        loader: 'style-loader',
                    },
                    'css-loader',
                    'less-loader'// 把 less 解析成 css
                ]
            }
        ]
    }
}