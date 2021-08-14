import Vue from 'vue';
import Router from 'vue-router';
import Store from '@/store';
import Layout from '../views/HomePage/Layout';
import NotAuthority from '../views/NotAuthority';
import CONFIG from '../assets/js/config';
// import {getUserInfo} from '@/api/login';
import {getAddressModelParams, getUserIP} from '../services/index';
import configFn from './routerConfig';

import HomePage from '../views/HomePage/HomePage';
import permissions from '../authority/module/permissions';

Vue.use(Router);
const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'LoginPage',
            component: () => { return import('@/views/Login'); },
        },
        {
            path: '/home',
            name: 'home',
            component: Layout,
            redirect: '/home_page',
            children: [
                {
                    path: '/home_page',
                    name: '首页',
                    component: () => { return import('@/views/HomePage/HomePage'); },
                },

                {
                    path: '/MerchantList',
                    name: '商户列表',
                    component: () => { return import('@/views/HomePage/MerchantManagement/MerchantList'); },
                },
                {
                    path: '/MerchantDealDetail',
                    name: '商户交易明细',
                    component: () => { return import('@/views/HomePage/MerchantManagement/MerchantDealDetail'); },
                },
                {
                    path: '/notAuthority',
                    name: '无权限页面',
                    component: NotAuthority,
                },
            ],
        },
        {
            path: '*',
            redirect: '/home_page',
        },
    ],
});


Store.commit('SAVE_PERMIT_PATH_INFO', permissions);
Store.commit('SAVE_PERMIT_RESOURCE_INFO', permissions);
// 设置默认选中菜单栏
Store.commit('SAVE_TAB_LABELS', {
    path: '/home_page',
    name: '首页',
    index: '1',
});
// 激活菜单
Store.commit('SAVE_NAV_INDEX', '1');

// // 激活菜单
// Store.commit('SAVE_NAV_INDEX', '00-00');
// const initEnter = false;

// const loadModule = (next) => {

//     let firstInx = '';
//     if (!CONFIG.PERMIT_MENU) {

//         // 获取默认菜单索引
//         firstInx = configFn.getRouteIndex(CONFIG.DEFAULT_PATH);
//     } else {

//         // 判断是否无资源
//         if (!Store.getters.permitPath.length) {
//             return next({
//                 path: '/notAuthority',
//             });
//         }

//         console.log(Store.getters.permitPath[0]);
//         // 获取默认菜单索引
//         firstInx = Store.getters.permitPath.indexOf(CONFIG.DEFAULT_PATH) > -1 ? configFn.getRouteIndex(CONFIG.DEFAULT_PATH) : configFn.getRouteIndex(Store.getters.permitPath[0]);
//         console.log(firstInx);
//         // if (!firstInx) {
//         //     return next({
//         //         path: '/notAuthority'
//         //     })
//         // }
//     }

//     if (!CONFIG.DEFAULT_PATH || CONFIG.DEFAULT_PATH === '/home_page') {
//         // 保存到多页签
//         Store.commit('SAVE_TAB_LABELS', {
//             path: '/home_page',
//             name: '工作台',
//             index: '00-00',
//         });

//         // 激活菜单
//         Store.commit('SAVE_NAV_INDEX', '00-00');
//         next({
//             path: '/home_page',
//             // path: 'product_management'
//         });
//     } else {

//         // 获取默认菜单信息
//         const firstNav = configFn.navJumpFn(firstInx);
//         console.log(firstNav);
//         // 跳转
//         next({
//             path: firstNav.path,
//         });
//     }
// };

// router.beforeEach((to, from, next) => {
//     const path = to.path.replace(/\/$/, '');
//     // console.log(path);
//     const isLogin = JSON.stringify(Store.getters.loginInfo) !== '{}';

//     // 获取当前地址参数
//     const queryParams = getAddressModelParams();

//     // 判断是否第一次进入
//     if (!isLogin && !initEnter) {
//         if (!CONFIG.PERMIT_MENU) {
//             initEnter = true;
//             console.log(path, 'path');
//             loadModule(next);
//             return;
//         }

//         // 如果没有登录信息的话在这里调下初始化接口，查询登录信息后保存
//         return new Promise((resolve) => {

//             // 保存token
//             CONFIG.ACCESS_TOKEN = `access_token=${queryParams.access_token}`;

//             getUserInfo({
//                 access_token: queryParams.access_token,
//             }).then(({data}) => {
//                 Store.commit('SAVE_LOGIN_INFO', data.data);
//                 // console.log(data.data)
//                 try {
//                     // Store.commit('SAVE_TOGGLE_WAREHOUSE', { name: data.permissions.menu_name, code: data.permissions.resource_params });
//                     Store.commit('SAVE_PERMIT_PATH_INFO', data.data.permissions);
//                     Store.commit('SAVE_PERMIT_RESOURCE_INFO', data.data.permissions);
//                 } catch (e) {
//                     Store.commit('SAVE_PERMIT_PATH_INFO', []);
//                     Store.commit('SAVE_PERMIT_RESOURCE_INFO', []);
//                 }
//                 resolve(1);
//             }).catch((err) => {
//                 console.error('load error -------------- \r\n ', err);
//             });
//         }).then(() => {
//             initEnter = true;
//             loadModule(next);
//         });
//     } else if (isLogin || initEnter) {
//         // 权限拦截
//         if (CONFIG.PERMIT_MENU) {
//             const isAuthority = [...Store.getters.permitPath, ...Store.state.allowPath];
//             if (isAuthority.indexOf(path) === -1 && path !== '/notAuthority') {
//                 return next({
//                     path: '/notAuthority',
//                 });
//             }
//         }

//         next();
//     } else {
//         next();
//     }
// });

// router.afterEach((to, from) => {
//     Store.commit('SAVE_KEEP_ALIVE_LABEL', {
//         type: 'push',
//         path: to.path,
//     });
// });

export default router;
