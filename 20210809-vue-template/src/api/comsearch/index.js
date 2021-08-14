import http from '@/http';

// 获取搜索配置列表
export function getSearchList (params = {}) {
    const obj = {...params, isRefresh: 3};
    return http.postAjax('/wish/wish_filter_data/get', obj);
}

export function getfields (params = {}) {
    return http.postAjax('/problem/fields', params);
}

export function chooseConditions (params = {}) {
    return http.postAjax('/problem/chooseConditions', params);
}
// Wish列表筛选项（testyou）
export function getMainList (params = {}) {
    return http.postAjax('/getMainList', params);
}


