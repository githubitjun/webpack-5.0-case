/*
 * @Author: 九天
 * @Date: 2021-06-11 10:45:12
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-11 14:09:33
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\history\01webpack.config.js
 */
const path = require('path')

module.exports = {
    mode:'development', // Set 'mode' option to 'development' or 'production'
    entry:'./src/index.js',// 入口
    output:{
        filename:'bundle.js',// 打包后的文件名   
        path:path.resolve(__dirname,'dist'),
        assetModuleFilename: 'images/[hash][ext][query]', // 来修改此模板字符串：
    },
    module:{
        rules:[
            {
                // 解析css 的loader, loader 有个执行的顺序, 从右到左,从下到上, style-loader--是将css 添加在html 文件的 <head> 中。
                // css-loader--解析css;  所以要先执行 css-loader, 再执行 style-loader 
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
              // 解析图片 现在 v5 版本的 比起之前的 v4 版本的使用更加简单了,  不需要之前 下载 url-loader 或者 file-loader 
              test: /\.(png|svg|jpg|jpeg|gif)$/i,
              type: 'asset/resource',
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
    // 使用了别名 https://webpack.docschina.org/configuration/resolve/#resolvealias 
    // 意思就是将 src 用 '@' 符号来代替了
    resolve:{
        alias:{
            '@':path.resolve(__dirname,'src/')
        }
    }
}
   