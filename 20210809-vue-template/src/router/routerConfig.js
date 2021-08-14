import Store from '@/store';
import CONFIG from '@/assets/js/config';

const config = {
    navList: [
        {
            name: '首页',
            path: '/home_page',
            icon: 'icon-shouye',
        },
        {
            name: '商户管理',
            icon: 'icon-daixiaokandengguanli',
            path: '',
            children: [
                {
                    name: '商户列表',
                    path: '/MerchantList',
                },
                {
                    name: '商户交易明细',
                    path: '/MerchantDealDetail',
                },
            ],

        },
    ],
};

const configFn = {
    navJumpFn (inx) {
        const configNav = this.getRouteConfig;
        const inxArr = inx.split('-');
        let to = {};
        try {
            switch (inxArr.length) {
                case 1:
                    to = configNav[inxArr[0] - 1];
                    break;
                case 2:
                    to = configNav[inxArr[0] - 1].children[inxArr[1] - 1];
                    break;
                case 3:
                    to = configNav[inxArr[0] - 1].children[inxArr[1] - 1].children[inxArr[2] - 1];
                    break;
            }
            return to;
        } catch (e) {
            return '/';
        }
    },
    getRouteIndex (path) {
        const configNav = this.getRouteConfig;
        const callBack = function (arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].path === path) {
                    return {
                        isTrue: 1,
                        index: i + 1,
                    };
                }

                if (arr[i].children && arr[i].children.length) {
                    const backInfo = callBack(arr[i].children);
                    if (backInfo && backInfo.isTrue) {
                        return {
                            isTrue: 1,
                            index: `${i + 1}-${backInfo.index}`,
                        };
                    }
                }
            }
        };

        const backInfo = callBack(configNav);
        return backInfo && backInfo.isTrue && backInfo.index;
    },

    _getRouteConfig: null,
    get getRouteConfig () {
        try {
            const configNav = [...config.navList];
            const permit = Store.getters.permitPath;
            const callBack = (arr) => {
                const itemList = [];
                arr.forEach((item) => {
                    if (item.children && item.children.length) {
                        if (callBack(item.children).length) {
                            item.children = callBack(item.children);
                            itemList.push(item);
                        }
                    } else if (permit.indexOf(item.path) > -1) {
                        itemList.push(item);
                    }
                });
                return itemList;
            };
            return callBack(configNav);
        } catch (e) {
            console.log(e);
        }
    },
};

export default configFn;
