import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import {message} from '../utils/message-box';
import {
    clearSessionStorage,
    getSessionStorage,
} from '@/utils/storage';
import CONFIG from '../assets/js/config';
import {Loading} from 'element-ui';
import router from '../router';

const rootApi = CONFIG.PRODUCTION_PATH;

const http = axios.create({
    timeout: '20000',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

// 关于请求loading:
// params.isRefresh = 1 ==> 半屏loading
// params.isRefresh = 2 ==> 全屏loading 且 是post类型
// params.isRefresh = 3 ==> 页面列表接口 且 是post类型 取消loading; ComTableInfo 组件增加 loading 效果
let loading = {};
const isPro = process.env.NODE_ENV === 'production';

http.interceptors.request.use((config) => {
    config.curRouter = router.app._route.path;
    const obj = JSON.parse(store.state.loadingParams);
    const params = qs.parse(config.data ? config.data : config.params);
    // get请求
    if (config.method === 'get' && params.isRefresh == 1) {
        obj[config.curRouter] = true;
    } else {
        obj[config.curRouter] = false;
    }

    // post请求
    if (config.method === 'post') {
        if (params.isRefresh == 2) {
            loading = Loading.service({
                lock: true,
                text: '',
                spinner: '',
                background: 'rgba(0, 0, 0, 0.7)',
            });
        } else if (params.isRefresh == 3) {
            obj[config.curRouter] = false;
        } else {
            obj[config.curRouter] = true;

        }
    }

    store.state.loadingParams = JSON.stringify(obj);
    return config;
}, (error) => {
    console.log(error);
});

http.interceptors.response.use((response) => {
    // 半屏 loading
    const obj = JSON.parse(store.state.loadingParams);
    obj[response.config.curRouter] = false;
    store.state.loadingParams = JSON.stringify(obj);
    if (response.config.method === 'post') {
        setTimeout(() => {
            loading.close && loading.close();
        }, 0);
    }
    store.commit('SAVE_LOADING_STATE', false);
    const {data, config} = response || {};
    if (data.status == 0) {
        const IsUrlConfigTipsHtml = [ // 配置 接口返回错误信息 显示html message
            '/wish/wish_shield_supple/add',
            '/wish/wish_shield_supple/edit',
        ];

        // 多条错误提示信息
        if (Array.isArray(data.error_mess)) {
            const str = data.error_mess.join(' <br/> ');
            message({
                dangerouslyUseHTMLString: true,
                message: str,
                type: 'error',
            });
        } else {
            message({
                type: 'error',
                dangerouslyUseHTMLString: IsUrlConfigTipsHtml.includes(config.url.split('?')[0]) ? true : false,
                message: data.errorMess || data.error_mess || '接口提示错误！',
            });
        }
    }

    return response;
}, (error) => {
    if (error.response.status === 401) {
        window.parent.postMessage({
            isOut: 1,
        }, isPro ? CONFIG.IN_PRODUCTION_PATH : CONFIG.IN_DEVELOPMENT_PATH);
    } else if (error.response.status === 402) {
        window.parent.postMessage({
            isOut: 2,
        }, isPro ? CONFIG.IN_PRODUCTION_PATH : CONFIG.IN_DEVELOPMENT_PATH);
    } else {
        store.commit('SAVE_LOADING_STATE', false);
        message({
            message: JSON.stringify(error.response),
            type: 'error',
        });
    }
});

http.getAjax = function (url, params) {
    params.org_code = store.state.loginInfo.org_code;
    params.staff_code = store.state.loginInfo.staff_code;
    url = isPro && url.indexOf('http://') < 0 ? rootApi + url : url;
    return http.get(`${url}?${CONFIG.ACCESS_TOKEN}`, {
        params: params,
    });
};

http.postAjax = function (url, params, third) {
    params.org_code = store.state.loginInfo.org_code;
    params.staff_code = store.state.loginInfo.staff_code;


    if (third) {
        const obj = qs.stringify(params);
        return http.post(`${url}?${CONFIG.ACCESS_TOKEN}`, obj, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
        });
    } else {
        url = isPro && url.indexOf('http://') < 0 ? rootApi + url : url;
        return http.post(`${url}?${CONFIG.ACCESS_TOKEN}`, params);
    }
};

http.fileAjax = function (url, params) {
    // params.org_code='yibai_00001';
    // params.staff_code='111';
    url = isPro && url.indexOf('http://') < 0 ? rootApi + url : url;
    return http.post(`${url}`, params, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default http;
