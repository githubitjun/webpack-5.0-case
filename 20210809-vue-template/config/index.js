'use strict';
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
const os = require('os');

console.log('NODE_ENV:', process.env.NODE_ENV);

// 获取本机ip
function getIPAdress () {
    const interfaces = os.networkInterfaces();
    // console.log('interfaces',interfaces);
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

const proxyTableTarget = {
    development: 'http://dp.yibai-it.com:10198',  // dev
    production: 'http://192.168.71.170:1806',  // build
};
module.exports = {
    dev: {

        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            // '/config': {
            //     // target: 'http://dp.yibai-it.com:30103',
            //     // target: 'http://192.168.71.209:81',
            //     changeOrigin: true,
            // },
            // // 大洋
            // '/real': {
            //     target: 'http://192.168.31.208:801',
            //     changeOrigin: true,
            // },
            // 梁芷凤
            // '/real': {
            //     target: 'http://192.168.31.187:10006',
            //     changeOrigin: true,
            // },
            // 涂翠萍
            // '/real': {
            //     target: 'http://192.168.31.198:8081',
            //     changeOrigin: true,
            // },
            // '/allegro': {
            //     target: 'http://192.168.31.198:8081',
            //     changeOrigin: true,
            // },
            // TSmile (王卫)
            // '/allegro': {
            //     target: 'http://192.168.31.154:8085',
            //     changeOrigin: true,
            // },
            // 开发
            '/': {
                target: proxyTableTarget[process.env.NODE_ENV] || '/',
                // pathRewrite: {
                //     '^/provider': '',//重写接口
                // },
                changeOrigin: true,
            },
        },

        // Various Dev Server settings
        host: getIPAdress(), // can be overwritten by process.env.HOST
        port: 8890, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true,
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/trunk/webfront/front/dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist/trunk/webfront/front/dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: process.argv.indexOf('--pro') > -1 ? '/' : '/front/dist/',

        /**
         * Source Maps
         */

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
    },
};
