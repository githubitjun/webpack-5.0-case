## webpack 安装
-安装本地的webpack 
    webpack webpack-cli -D  (-D 的意思是说只在开发环境需要)

    01.默认打包命令  npx webpack 
    02.当 不存在webpack.config.js 这个配置文件的名称时, 就是给webpack.config.js 改了个别的名字 webpack.config.my.js
        想要打包的命令是:  npx webpack --config webpack.config.my.js

    webpack-dev-server 可以启动 一个本地服务

    // 抽离css 样式的c插件 mini-css-extract-plugin -D 
    // yarn add postcss-loader autoprefixer -D 这个可以为 css 样式兼容浏览器添加前缀 -webkit

    optimize-css-assets-webpack-plugin -D// 将css 进行压缩
    uglifyjs-webpack-plugin -D // 将js 进行压缩

    将es6 转换为es5 的 babel-loader @babel/core @babel/preset-env -D
    将 es6 的class 语法转换的插件   @babel/plugin-proposal-class-properties -D
    将 es6 的类的 装饰器进行转换 @babel/plugin-proposal-decorators -D

    将 一个第三方插件变成 全局的 比如将 jquery 可以用 window.$ 来输出 可以使用 expose-loader

    解析图片 file-loader
    解析图片使用更多的是  url-loader

    编译解析html:   npm install html-withimg-loader --save  html中直接使用img标签src加载图片的话，因为没有被依赖，图片将不会被打包。