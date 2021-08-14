import dayjs from 'dayjs';
import {handleSettingDefaultTime} from '@/components/ComSearchConfig/util';

export const pickerTimeOptions = {
    shortcuts: [{
        text: '当日',
        onClick (picker) {
            const start = dayjs().hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const end = dayjs().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            picker.$emit('pick', [start, end]);
        },
    }, {
        text: '昨日',
        onClick (picker) {
            const start = dayjs().subtract(1, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const end = dayjs().subtract(1, 'day').hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            picker.$emit('pick', [start, end]);
        },
    }, {
        text: '本月',
        onClick (picker) {
            const start = dayjs().subtract(dayjs().get('date') - 1, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const end = dayjs().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            picker.$emit('pick', [start, end]);
        },
    }, {
        text: '上月',
        onClick (picker) {
            const start = dayjs().subtract(1, 'month').subtract(dayjs().get('date') - 1, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const end = dayjs().subtract(dayjs().get('date'), 'day').hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            picker.$emit('pick', [start, end]);
        },
    }, {
        text: '过去2天',
        onClick (picker) {
            const start = dayjs().subtract(1, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const end = dayjs().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            picker.$emit('pick', [start, end]);
        },
    }, {
        text: '过去3天',
        onClick (picker) {
            const start = dayjs().subtract(2, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const end = dayjs().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            picker.$emit('pick', [start, end]);
        },
    },
    {
        text: '过去7天',
        onClick (picker) {
            const start = dayjs().subtract(6, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const end = dayjs().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            picker.$emit('pick', [start, end]);
        },
    }, {
        text: '过去30天',
        onClick (picker) {
            const start = dayjs().subtract(29, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const end = dayjs().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
            picker.$emit('pick', [start, end]);
        },
    }],
};
export const pickerMonthOptions = {
    shortcuts: [{
        text: '本月',
        onClick (picker) {
            picker.$emit('pick', [new Date(), new Date()]);
        },
    }, {
        text: '上月',
        onClick (picker) {
            const start = new Date();
            start.setMonth(start.getMonth() - 1);
            picker.$emit('pick', [start, start]);
        },
    }, {
        text: '今年至今',
        onClick (picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
        },
    }, {
        text: '最近六个月',
        onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
        },
    }],
};

// 默认配置，对应模块的pid http://192.168.71.156/web/#/121?page_id=5218
/*
2.大仓配置
*/
export const defaultConfig = {
    1: '/MerchantList', // 在线listing管理
};

// 设置默认查询参数  与配置的id对应
export const defaultQueryParams = {
    // 1: {
    //     fn (query) {
    //         query.status = ['1'];
    //         query.createTime = handleSettingDefaultTime(3);
    //     },
    // },
};

// 需搜索配置 页面
export const searchCofingPage = [

];

// 需搜索配置 页面 是否分级
export const searchCofingOnes = {

};

// 组合所有配置
export const defaultAllconfig = {
    ...defaultConfig,
};

// 单独导出默认配置
export const defaultConfigArr = Object.keys(defaultConfig).map((item) => { return defaultConfig[item]; });
