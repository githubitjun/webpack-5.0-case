<!--
 * @Author: 九天
 * @Date: 2021-06-11 10:28:10
 * @LastEditors: 九天
 * @LastEditTime: 2021-06-11 15:12:27
 * @Description: 
 * @FilePath: \20210611-webpack-v5-01\node.md
-->
## npm run watch 

    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "watch":"webpack --watch", 
        "build": "webpack --config webpack.config.js"
    },
     npm run watch  执行之后 会自动检测到 代码的修改 然后自动打包

## webpack-dev-server 开启 web server
    https://webpack.docschina.org/configuration/dev-server/
    npm install --save-dev webpack-dev-server

    "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1",
                "watch": "webpack --watch",
                "dev":"webpack server --open",
                "build": "webpack --config webpack.config.js"
        },
     "dev":"webpack server --open", 开启服务 --open 并自动打开浏览器

     热更新: https://webpack.docschina.org/guides/hot-module-replacement/

## webpack-dev-middleware 
    是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server。 https://webpack.docschina.org/guides/development/