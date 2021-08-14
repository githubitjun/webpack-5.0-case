import button_config from './../../authority/button_config';
// 2020-12-23
const HEIGHTINFO = {
    NAV: 0,
    TAP_HEIGHT: 31, // 多页签高度
    TABLE_MARGIN: 0,
};
// 2020-12-23 END
const HEIGHT_INFO = {
    NAV: 0,
    WINDOW_HEIGHT: window.innerHeight,
    TAP_HEIGHT: 30,
    TABLE_MARGIN: 0,
};

const CONFIG = {
    // 2020-12-23
    PAGE_DATA: {
        offset: 1,
        currentList: 20,
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
    },
    setTableHeight (_e, other, _d) {
        let extra = _d ? [] : ['ui-search-area', 'ui-fn-module', 'ui-main-module-page', 'ui-tab-warp'];
        if (other && other.length) {
            extra = extra.concat(other);
        }

        const mainView = window.getEleAttr(`.${_e}`);
        let tableHeight = HEIGHTINFO.NAV + HEIGHTINFO.TAP_HEIGHT + (_d ? 0 : HEIGHTINFO.TABLE_MARGIN);
        const userAgent = navigator.userAgent;
        for (let i = 0; i < extra.length; i++) {

            // 获取容器元素
            const ele = window.getEleAttr(`.${extra[i]}`, mainView);
            if (!ele) { continue; }
            tableHeight += ele.offsetHeight;

            let eleMargin, eleTBMargin;
            const eleCss = document.defaultView.getComputedStyle(ele);
            if (userAgent.indexOf('Firefox') > -1) {
                eleTBMargin = parseInt(eleCss['margin-top']) + parseInt(eleCss['margin-bottom']);
            } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !userAgent.indexOf('Opera') > -1) {
                const ieCss = ele.currentStyle;
                eleTBMargin = parseInt(ieCss.marginTop) + parseInt(ieCss.marginBottom);
            } else {
                eleMargin = eleCss.margin.split(' ');
                eleTBMargin = parseInt(eleMargin[2]) ? parseInt(eleMargin[0]) + parseInt(eleMargin[2]) : parseInt(eleMargin[0]);
            }

            tableHeight = eleTBMargin + tableHeight;
        }
        tableHeight = window.innerHeight - tableHeight - 6 - 50;
        return `${tableHeight}`;
    },

    // 2020-12-23 END
    HEIGHT_INFO,
    DEFAULT_PAGE_SIZES: [20, 50, 100, 200],
    PAGE_PARAMS: {
        PROP: {
            PAGE: 'offset',
            SIZE: 'limit',
        },
        DEFAULT: {
            ['offset']: 1,
            ['limit']: 20,
        },
    },
    RULE: {
        REQUIRE_BLUR: {
            required: true,
            message: '带*号为必填项',
            trigger: 'blur',
        },
        REQUIRE_CHANGE: {
            required: true,
            message: '带*号为必填项',
            trigger: 'change',
        },
        NUMBER: {
            pattern: /^[0-9]{1,5}$/,
            message: '输入有误！',
            trigger: 'blur',
        },
    },

    IN_PRODUCTION_PATH: document.referrer,
    IN_DEVELOPMENT_PATH: `http://${window.location.hostname}:8864`,
    PRODUCTION_PATH: window.location.origin,

    // 搜索框宽度
    SEARCH_DATE_WIDTH: '438',

    // 权限资源
    AUTHORITY_BUTTON: {},

    // JAVA接口地址
    JAVA_PATH: '',

    // JAVA头部信息
    JAVA_HTTP_HEADER: {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    },

    ACCESS_TOKEN: '',

    uploadPath: '',
    access_token: '',

    // 打印服务地址
    PRINT_SERVICE: 'http://192.168.4.173:9130',

    // 服务器绝对路径
    ROOT_URL: process.env.NODE_ENV === 'production' ? process.env.ASSETS_PUBLIC_PATH : '/front',

    // MAC地址
    MAC_ADDRESS: '',

    // 校验菜单权限
    PERMIT_MENU: true,

    // 校验按钮权限
    PERMIT_BUTTON: true,

    // 默认跳转菜单
    DEFAULT_PATH: '',

    // 是否开启新样式主题配置
    THEME_CONFIG: false,

    // 按钮权限控制
    buttonList: button_config,

};
export default CONFIG;
