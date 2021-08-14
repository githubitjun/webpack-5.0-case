/*
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-04 15:16:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\store\state.js
 */
const states = {

    // 页面loading
    showLoading: false,

    // 登录用户信息
    loginInfo: {},

    //
    buttonList: [],

    // 校验路由
    permitPath: [],

    // 跳过校验路由
    allowPath: [],

    // 权限资源
    permitResource: {},

    // 页面查询参数
    queryParamsInfo: {},

    // 页签
    tabLabel: [],

    // 导航栏
    navIndex: '1',

    // 缓存标签
    keepAliveLabel: [],
    // 公共搜索配置
    searchConfig: {},

    // 勾选搜索条件
    checkedSearchInfo: [],
    checkedMainData: [],
    searchConfigItems: [],
    // loading参数
    loadingParams: '{}',
};

export default states
;
