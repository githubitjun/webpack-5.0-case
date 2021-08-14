/**
 * Name: 公共数据混合
 * User: YnmauSu
 * Date: 2020/3/10
 * Time: 17:38
 *
 */

import {
    mapGetters,
} from 'vuex';
import CONFIG from '@/assets/js/config';
import {
    getCommonOptions,
} from '@/api/common';
const mixinData = {
    data () {
        return {
            pageData: {
                currentList: 20,
                currentTotal: 0,
                currentPage: 1,
            },
            tableKey: [],
            tableProps: [],
            tableData: [],
            optionList: {},
            queryOption: {},

            tableConfigData: {},
        };
    },
    computed: {
        ...mapGetters([
            'queryParamsInfo',
            'loginInfo',
        ]),
    },
    async mounted () {
        try {
            if (this.Reset) { this.Reset(); }// 回调当前页面需要重置默认操作
            this.handleGetOptions();
            if (this.isNotLoad) { return; } // 默认进来不加载
            this.handleQueryInfo();
        } catch (e) {
            console.log(e);
        }
    },
    methods: {

        getOptions: getCommonOptions,

        // 获取下拉
        async handleGetOptions () {
            if (this.getOptions && this.needOptions) {
                const {data} = await this.getOptions({types: this.needOptions});
                if (data.data_list) {
                    this.optionList = {
                        ...this.optionList,
                        ...data.data_list,
                    };
                } else {
                    this.optionList = {
                        ...this.optionList,

                    };
                }
            }
        },

        // 分页操作
        handleSizeChange (size) {
            this.handleQueryInfo({
                [CONFIG.PAGE_PARAMS.PROP.SIZE]: size,
                [CONFIG.PAGE_PARAMS.PROP.PAGE]: 1,
                isFn: true,
            });
        },
        handleCurrentChange (val) {
            this.handleQueryInfo({
                [CONFIG.PAGE_PARAMS.PROP.SIZE]: this.pageData.currentList,
                [CONFIG.PAGE_PARAMS.PROP.PAGE]: val,
                isFn: true,
            });
        },

        // 重置
        handleResetQueryInfo () {
            const obj = this.queryData;
            for (const key in obj) {
                switch (typeof obj[key]) {
                    case 'number':
                        obj[key] = '';
                        break;
                    case 'string':
                        obj[key] = '';
                        break;
                    case 'boolean':
                        obj[key] = false;
                        break;
                    case 'object':
                        obj[key] = obj[key] instanceof Array ? [] : {};
                        break;
                }
            }
            this.queryData = obj;

            if (this.Reset) { this.Reset(); }// 回调当前页面需要重置默认操作
        },

        // 查询操作
        handleQueryOperation ({apiFn, params, success} = {params: {}}) {

            // 判断是否为功能参数
            if (params.isFn) {

                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo[this.$options.name]);
            }

            delete params.isFn;

            // 有特殊字段处理的通过 params 处理完传进来
            const obj = {
                ...this.queryData,
                ...params,
            };

            this.tableKey = [];
            this.tableProps = [];
            this.tableData = [];
            this.tableConfigData = {};
            apiFn && apiFn(obj).then(({data}) => {

                if (data.status) {

                    // 保存查询参数
                    this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                        key: this.$options.name,
                        value: JSON.stringify(this.queryData),
                    });
                    let obje = {};
                    data.data_list.key.forEach((item) => {
                        obje = {...obje, [item.props]: item.key};
                    });
                    // 渲染数据
                    this.tableKey = this.tableKey.length ? this.tableKey : ['序号', ...Object.values(obje)];
                    this.tableProps = this.tableProps.length ? this.tableProps : ['index', ...Object.keys(obje)];
                    console.log(this.tableKey);
                    console.log(this.tableProps);
                    this.tableData = data.data_list.value;
                    this.tableConfigData = {
                        index: '序号',
                        ...obje,
                    };

                    // 渲染分页
                    this.pageData.currentList = data.data_list.page_data.limit * 1;
                    this.pageData.currentPage = data.data_list.page_data.offset * 1;
                    this.pageData.currentTotal = data.data_list.page_data.total * 1;

                    success && success.apply(this, [data]);
                } else {
                    this.tableData = [];
                    if (this.summaryData) {
                        this.summaryData = [];
                    }
                    this.$message.error(data.errorMess || '查询失败！');
                }
            });
        },

        // 常规删除操作
        handleComDelete ({api, params, success}) {
            this.$confirm('当被删除后不可再恢复，是否要删除？', '提示', {
                type: 'warning',
            }).then(({data}) => {
                api(params).then(({data}) => {
                    this.handleOperationCallBack(data, () => {
                        success && success.apply(this, [data]);
                    });
                });
            });
        },

        // 常规确认操作
        handleComConfirm (msg = '确认操作？', {api, params, success}) {
            this.$confirm(msg, '提示', {
                type: 'warning',
            }).then((res) => {
                api(params).then(({data}) => {
                    this.handleOperationCallBack(data, () => {
                        success && success.apply(this, [data]);
                    });
                });
            });
        },

        // 操作回调
        handleOperationCallBack (data, success) {
            if (data.status === 1) {
                // this.$message({
                //     dangerouslyUseHTMLString: true,
                //     message: data.errorMess||'<p>操作成功</p>',
                //     type: 'success'
                // });
                this.$message.success(data.errorMess || '操作成功');
                this.handleQueryInfo({[CONFIG.PAGE_PARAMS.PROP.SIZE]: this.pageData.currentList});
                success && success();
            } else if (data.status === 3) {
                const arry = data.data_list;
                const list = [];
                arry.forEach((item) => {
                    list.push(item.sku + ',' + item.message + '</br>');
                });
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: list.join('') || '',
                    type: 'warning',
                });
                this.handleQueryInfo({[CONFIG.PAGE_PARAMS.PROP.SIZE]: this.pageData.currentList});
                success && success();
            } else {
                // this.$message.error(data.errorMess || '操作失败');
            }
        },
    },
};

export default {
    ...mixinData,
}
;
