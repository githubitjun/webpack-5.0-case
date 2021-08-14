/*
 * @Author: your name
 * @Date: 2021-06-04 15:41:44
 * @LastEditTime: 2021-06-05 15:25:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\authority\module\permissions.js
 */

const permissions = [
    {
        children: [
        ],
        menu_name: '首页',
        resource_name: 'home_page',
        resource_params: '',
        resource_path: '/home_page',
    },
    {
        menu_name: '商户列表',
        resource_name: 'MerchantList',
        resource_params: '',
        resource_path: '/MerchantList',
        children: [
            {
                menu_name: '新建商户',
                resource_name: 'add',
                resource_params: '',
                resource_path: '/add',
            },
            {
                menu_name: '导出',
                resource_name: 'export',
                resource_params: '',
                resource_path: '/export',
            },
        ],
    },
    {
        menu_name: '商户列表',
        resource_name: 'MerchantDealDetail',
        resource_params: '',
        resource_path: '/MerchantDealDetail',
        children: [
            {
                menu_name: '新建商户',
                resource_name: 'add',
                resource_params: '',
                resource_path: '/add',
            },
            {
                menu_name: '导出',
                resource_name: 'export',
                resource_params: '',
                resource_path: '/export',
            },
        ],
    },
];

export default permissions;
