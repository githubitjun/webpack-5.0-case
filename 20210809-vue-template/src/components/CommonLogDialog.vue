<style lang="less" scoped>

</style>

<template>
    <div class="CommonLogDialogwrap">
        <!-- 公共日志弹窗 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            :title="logInfo.title"
            width="950px"
            :visible.sync="logInfo.isShowLog"
            :before-close="handleClose">
            <ComPreviewTable
                :isAdaptiveHeight="false"
                :logData="logInfo.tableData"
                :tableConfigList="logInfo.tableConfigList"
                :tableLoading="tableLoading" />
            <span slot="footer">
                <el-button size="small" @click="handleClose()">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'CommonLogDialog',
    data () {
        return {
            // 日志
            logInfo: {
                title: '',
                isShowLog: false,
                tableData: [],
                tableConfigList: [],
            },
            tableLoading: false,
            // 定义原始数据
            originlogInfo: {
                title: '操作日志',
                tableData: [],
                tableConfigList: [
                    {key: '内容', props: 'behavior', width: ''},
                    {key: '修改人', props: 'create_name', width: '200'},
                    {key: '修改时间', props: 'create_time', width: '200'},
                ],
            },
        };
    },
    methods: {
        // show(api, params, obj)   api 日志接口地址 params 请求参数 obj 覆盖日志默认设置

        show (api, params, obj) {
            this.logInfo.isShowLog = true;
            this.logInfo.tableData = [];
            if (obj) {
                this.logInfo = {
                    ...this.logInfo,
                    ...JSON.parse(JSON.stringify(this.originlogInfo)),
                    ...obj,
                };
            }
            this.tableLoading = true;
            api(params).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
                    return;
                }
                // 对接口返回的不同日志字段做兼容
                if (Array.isArray(data.data_list)) {
                    this.logInfo.tableData = data.data_list;
                }
                if (Array.isArray(data.data_list.value)) {
                    this.logInfo.tableData = data.data_list.value;
                }
                if (Array.isArray(data.data_list.records)) {
                    this.logInfo.tableData = data.data_list.records;
                }
                if (Array.isArray(data.data_list.data)) {
                    this.logInfo.tableData = data.data_list.data;
                }
                if (data.data_list.data && Array.isArray(data.data_list.data.values)) {
                    this.logInfo.tableData = data.data_list.data.values;
                }
            }).finally(() => {
                this.tableLoading = false;
            });
        },
        handleClose () {
            this.logInfo.isShowLog = false;
            this.logInfo.tableData = [];
            this.tableLoading = false;
        },
    },
};
</script>
