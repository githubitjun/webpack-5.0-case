// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import component from './components';
import CONFIG from '@/assets/js/config';
import store from './store';
import * as Storage from './utils/storage';
import mock from './mock';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css';
import '@/assets/css/135editor.css';
import '@/assets/fonts/iconfont.css';
import '@/assets/less/index.less';
import '@/assets/less/common.less';
import '@/assets/css/common.css';
import promise from 'es6-promise';
import directive from '@/directive';
import 'viewerjs/dist/viewer.min.css';
import VueLazyload from 'vue-lazyload';  // 图片懒加载

import {getConfigInfo} from '@/api/common';

import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

Vue.use(VXETable);

// 图片懒加载
Vue.use(VueLazyload, {
    error: require('./assets/image/default_error.png'),
    loading: require('./assets/image/img_loading.gif'),
});

// axios 请求兼容
promise.polyfill();

Vue.config.productionTip = false;
Vue.use(ElementUI);

/* 注册全局组件 */
Object.keys(component).forEach((key) => {
    const name = key.replace(/(\w)/, (v) => { return v.toUpperCase(); }); // 首字母大写
    Vue.component(`${name}`, component[key]);
});

/* 注册全局指令 */
Object.keys(directive).forEach((key) => {
    Vue.directive(`${key}`, directive[key]);
});

window.getEleAttr = function (_e, parent) {
    return parent ? parent.querySelector(_e) : document.querySelector(_e);
};

HTMLElement.prototype.pressKey = function (code) {
    const evt = document.createEvent('UIEvents');
    evt.keyCode = code;
    evt.initEvent('keyup', true, true);
    this.dispatchEvent(evt);
};

// 转换日期格式
Date.prototype.format = function (format) {
    const o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(),    // day
        'h+': this.getHours(),   // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3),  // quarter
        'S': this.getMilliseconds(), // millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};

window.empty = function (val) {
    return !val && val !== 0;
};

// 加载样式
const LinkHtml = document.createElement('link');
LinkHtml.rel = 'stylesheet/less';
LinkHtml.href = process.env.NODE_ENV === 'production' ? `${process.env.ASSETS_PUBLIC_PATH}static/theme/less/theme.less` : './static/theme/less/theme.less';
document.head.appendChild(LinkHtml);
window.less = require('less');

if (CONFIG.THEME_CONFIG) {

    window.parent.postMessage({
        new_theme: true,
    }, CONFIG.IN_PRODUCTION_PATH);

    window.addEventListener('message', (e) => {
        if (e.data && e.data.theme) {
            window.less.modifyVars({...e.data.theme}).then(() => {
                new Vue({
                    el: '#app',
                    router,
                    store,
                    components: {App},
                    template: '<App/>',
                });
            });
        }

        if (e.data && e.data.macAddress) {
            CONFIG.MAC_ADDRESS = e.data.macAddress;
        }
    });
} else {
    new Vue({
        el: '#app',
        router,
        store,
        components: {App},
        template: '<App/>',
    });
}

