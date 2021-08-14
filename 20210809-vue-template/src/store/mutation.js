
import * as types from './mutation-type';
import * as Storage from '@/utils/storage';
import Store from '@/store';
import buttonList from '../authority/button_config';

export default {
    [types.SAVE_LOADING_STATE] (state, data) {
        state.showLoading = data;
    },

    // 保存登录信息
    [types.SAVE_LOGIN_INFO] (state, loginInfo) {
        state.loginInfo = loginInfo;
        Storage.setSessionStorage('userInfo', loginInfo ? JSON.stringify(loginInfo) : '');
    },

    // 保存按钮配置
    [types.SAVE_BUTTON_CONFIG] (state, saveInfo) {
        state.buttonList = buttonList[saveInfo.replace(/^[\/]/, '')] && buttonList[saveInfo.replace(/^[\/]/, '')].buttonList;
    },

    // 保存查询参数
    [types.SAVE_QUERY_PARAMS_INFO] (state, saveInfo) {
        state.queryParamsInfo[saveInfo.key] = saveInfo.value;
    },

    // 保存权限资源菜单
    [types.SAVE_PERMIT_PATH_INFO] (state, infoList) {
        const arr = [];
        for (let i = 0; i < infoList.length; i++) {
            arr.push(infoList[i].resource_path);
        }
        state.permitPath = state.allowPath.concat(arr);
    },

    // 保存权限资源按钮
    [types.SAVE_PERMIT_RESOURCE_INFO] (state, infoList) {
        // 递归函数
        const callBack = function (children, saveObj, isRoot) {
            if (children && children.length) {
                for (let i = 0; i < children.length; i++) {
                    if (children[i].children && children[i].children.length) {
                        saveObj[children[i].resource_name] = {};
                        callBack(children[i].children, saveObj[children[i].resource_name]);
                    } else {
                        saveObj[children[i].resource_name] = true;
                    }
                }
            } else if (isRoot) {
                return true;
            }
        };
        const obj = {};
        for (let i = 0; i < infoList.length; i++) {
            obj[infoList[i].resource_name] = {};
            callBack(infoList[i].children, obj[infoList[i].resource_name], true) === true ? obj[infoList[i].resource_name] = true : false;
        }
        console.log(1, obj);

        state.permitResource = obj;
    },

    /**
     * 保存页签:
     *  @saveInfo ->
         *  @isRemove 移除页签 Number 1 移除单个  2移除多个
         *  @main 子页面的主页面路由地址
         *  @path 操作路由地址
         *  @name 显示页签名称
         *  @index 唯一索引
         *  @labelIndex 插入位置
         *
     * **/
    [types.SAVE_TAB_LABELS] (state, saveInfo) {

        if (saveInfo.isRemove === 1) {

            // 移除单个标签
            state.tabLabel.splice(saveInfo.isRemoveInx, 1);
        } else if (saveInfo.isRemove === 2) {
            const leaveArr = [];
            for (let i = 0; i < state.tabLabel.length; i++) {
                if (state.tabLabel[i].path === saveInfo.path) {
                    leaveArr.push(state.tabLabel[i]);
                    break;
                }
            }
            state.tabLabel.splice(0);
            state.tabLabel = leaveArr;
        } else {
            for (let i = 0; i < state.tabLabel.length; i++) {
                if (state.tabLabel[i].path === saveInfo.path) {
                    return;
                }
            }
            if (state.tabLabel.length > 7) {
                state.tabLabel.shift();
            }

            if (saveInfo.labelIndex || saveInfo.labelIndex === 0) {
                state.tabLabel.splice(saveInfo.labelIndex, 0, saveInfo);
            } else {
                state.tabLabel.push(saveInfo);
            }
        }
    },

    // 导航激活INDEX
    [types.SAVE_NAV_INDEX] (state, saveInfo) {
        state.navIndex = saveInfo;
    },

    // 保存缓存标签
    [types.SAVE_KEEP_ALIVE_LABEL] (state, data) {
        switch (data.type) {
            case 'push':
                if (!state.keepAliveLabel.includes(data.path)) {
                    state.keepAliveLabel.push(data.path);
                }
                break;
            case 'del':
                const inx = state.keepAliveLabel.indexOf(data.path);
                if (inx > -1) {
                    state.keepAliveLabel.splice(inx);
                }
                break;
            case 'allDel':
                state.keepAliveLabel.splice(0);
                break;
            case 'only':
                state.keepAliveLabel.splice(0);
                state.keepAliveLabel.push(data.path);
                break;
        }
    },
    // 公共搜索配置
    [types.SAVE_COMMON_SEARCH_CONFIG] (state, info) {
        if (info.all_data) {
            state.searchConfig.all_data = info.all_data;
            state.searchConfig.main_data = info.main_data;
            state.searchConfig.orgin_all_data = info.orgin_all_data;
        }
    },
    // 搜索配置勾选值
    [types.SAVE_CHECK_SEARCH_INFO] (state, saveInfo) {
        state.checkedSearchInfo = saveInfo;
    },
    // 搜索配置选项
    [types.SAVE_SEARCH_CONFIG_ITEMS] (state, saveInfo) {
        state.searchConfigItems = saveInfo;
    },
    // 查询条件
    [types.SAVE_CHECK_MAINDATA] (state, saveInfo) {
        state.checkedMainData = saveInfo;
    },
}
;
