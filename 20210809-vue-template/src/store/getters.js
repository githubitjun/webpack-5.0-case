
const getters = {
    loginInfo: (state) => { return state.loginInfo; },
    showLoading: (state) => { return state.showLoading; },
    buttonList: (state) => { return state.buttonList; },
    queryParamsInfo: (state) => { return state.queryParamsInfo; },
    permitPath: (state) => { return state.permitPath; },
    permitResource: (state) => { return state.permitResource; },
    loadingParams: (state) => { return state.loadingParams; },

    // 导航激活index
    navIndex: (state) => { return state.navIndex; },

    // 多页签
    tabLabel: (state) => { return state.tabLabel; },

    // 保存缓存标签
    keepAliveLabel: (state) => { return state.keepAliveLabel; },

    // 搜索配置
    searchConfig: (state) => { return state.searchConfig; },
    // 勾选搜索条件
    checkedSearchInfo: (state) => { return state.checkedSearchInfo; },
    // 选中搜索条件
    checkedMainData: (state) => { return state.checkedMainData; },
    searchConfigItems: (state) => { return state.searchConfigItems; },
    // 保存查询参数
};

export default getters;
