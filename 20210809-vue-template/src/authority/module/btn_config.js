/*
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-05 15:06:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\authority\module\real_btn_config.js
 */
// ====== real 模块 权限资源按钮 配置  ========

/**
 * 描述：权限按钮配置 拆分模块
 * 使用：以 路由名称 作为 key值-参考下方
 */
import {generateButtonConfig} from '@/authority/module/generate_button_config';

const btnConfig = {
    // 路由名称
    home_page: {
        name: '首页',
        buttonList: generateButtonConfig(
            [

            ],
            'home_page',
        ),
    },
    MerchantList: {
        name: '商户管理-商户列表',
        buttonList: generateButtonConfig(
            [
                {name: '新建商户', id: 'add'},
                {name: '导出', id: 'export'},
            ],
            'MerchantList',
        ),
    },
    MerchantDealDetail: {
        name: '商户管理-商户交易明细',
        buttonList: generateButtonConfig(
            [
                {name: '新建商户', id: 'add'},
                {name: '导出', id: 'export'},
            ],
            'MerchantDealDetail',
        ),
    },
};

export {
    btnConfig,
};

