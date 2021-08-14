/*
 * @Author: 九天
 * @Date: 2021-04-13 20:48:30
 * @LastEditors: 九天
 * @LastEditTime: 2021-08-09 18:13:48
 * @Description: 
 * @FilePath: \20210413-koa\app.js
 */

let koa = require('koa')
const router = require('koa-router')();
const app = new koa();



/*  query和querystring区别
    在koa2中GET请求通过request接收，但是接受的方法有两种：query和querystring。
    query：返回的是格式化好的参数对象。
    querystring：返回的是请求字符串。
*/

// 添加 cookie
router.get('/index', function (ctx, next) {
    ctx.cookies.set(
        'MyName', 'JSPang', {
        domain: 'localhost', // 写cookie所在的域名
        path: '/',       // 写cookie所在的路径
        maxAge: 1000 * 60 * 60 * 1,   // cookie有效时长
        expires: new Date('2021-08-10'), // cookie失效时间
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
    }
    );
    ctx.body = 'cookie is ok';
});
// // 显示cookie 的值
router.get('/showcookie', function (ctx, next) {
    if (ctx.cookies.get('MyName')) {
        ctx.body = ctx.cookies.get('MyName');
    } else {
        ctx.body = 'Cookie is none';
    }
});
// // 获取参数
router.get('/querydata', function (ctx, next) {
    // /querydata?params = 11

    let url = ctx.url;

    // //从request中获取GET请求
    let request = ctx.request;
    let req_query = request.query; // 获取get 请求的参数对象
    let req_querystring = request.querystring; //获取get 请求的参数的字符串
    // console.log(ctx);

    // 从上下文中直接获取
    let ctx_query = ctx.query;
    let ctx_querystring = ctx.querystring
    ctx.body = {
        url,
        req_query,
        req_querystring,
        ctx_query,
        ctx_querystring
    }
});


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('running');
})


