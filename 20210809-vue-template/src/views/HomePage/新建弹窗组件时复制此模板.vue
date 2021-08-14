<!--
 * @Author: your name
 * @Date: 2021-06-05 14:47:45
 * @LastEditTime: 2021-06-05 15:15:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\views\HomePage\新建弹窗组件时复制此模板.vue
-->
<template>
    <el-dialog
        class="ui-layout_edit-dialog"
        :title="params.title"
        :visible.sync="dialogObj.dialog"
        :close-on-click-modal="false"
        width="888px"
        top="20vh"
        @close="handleClose">
        <!-- 弹窗主体内容 -->
        <div v-loading="logLoading" class="dialogObjbox">
            内容
        </div>
        <!-- 弹窗主体内容 -->
        <div slot="footer">
            <el-button size="small" @click="handleClose">
                关闭
            </el-button>
            <el-button
                size="small" type="primary"
                :loading="submitTag"
                @click="submitFn">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            dialogObj: {
                dialog: false, // 显示or隐藏
            },
            logLoading: false, // 记载loading
            submitTag: false, // 提交按钮loading
            // 数据暂存
            params: {},

        };
    },
    methods: {
        show (params) {
            // 展示弹窗
            this.dialogObj.dialog = true;
            // 暂存数据
            this.params = params;
            const obj = params;
            this.initData(obj);
        },

        // 初始化数据
        initData (obj) {

        },

        // 提交方法
        submitFn () {

        },
        submitApi (api, paramsObj) {
            this.submitTag = true;
            api(paramsObj).then(({data}) => {
                if (data.status) {
                    this.$message.success(data.error_mess || '操作成功！');
                    this.handleClose();
                    this.$parent.handleQueryInfo({limit: this.$parent.pageData.currentList, page: this.$parent.pageData.currentPage}, true);
                }
            }).finally(() => {
                this.submitTag = false;
            });
        },

        handleClose () {
            this.dialogObj.dialog = false;
            // this.formData = this.$options.data().formData;
            // this.$refs.formData.resetFields();
        },
    },
};
</script>

<style lang="less" scoped>

</style>
