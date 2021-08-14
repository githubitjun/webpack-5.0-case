<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-05 14:06:53
 * @LastEditors: Please set LastEditors
 * @Description: 分页组件
 * @FilePath: \dailishang\src\components\ComPageConfig.vue
-->
<style lang="less" scoped>
</style>
<template>
    <div class="ui-main-module-page">
        <el-pagination
            v-loading="pageLoading"
            background
            :disabled="pageDisabled"
            :current-page="pageData.currentPage"
            :page-sizes="pageSizes"
            :page-size="pageData.currentList"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.currentTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>
<script>
/**
 *
 * @params pageAllData: 列表接口 后端返回total的集合
 * @params pageSize: 初始化 列表默认展示 每页几条数据 10/20/50/100/500
 * @params pageDisabled: 加载时 分页是否禁用
 */
import CONFIG from '@/assets/js/config';
export default {
    name: 'ComPageConfig',
    props: {
        pageAllData: {
            type: Object,
            default () {
                return {};
            },
        },
        pageSize: {
            type: Number,
            default: 20,
        },
        pageDisabled: {// 加载时 分页是否禁用
            type: Boolean,
            default: true,
        },
    },
    data () {
        return {
            vm: this,
            pageLoading: false, // 总条数计算接口loading
            // 分页数据
            pageSizes: CONFIG.PAGE_DATA.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: this.pageSize ? this.pageSize : 10,
                currentTotal: 0,
            },
        };
    },
    watch: {
        pageAllData: {
            handler (val) {
                // console.log(val, 'val');
                this.pageData.currentPage = val.offset ? Number(val.offset) : 1;
                this.pageData.currentList = val.limit ? Number(val.limit) : this.pageData.currentList;
                this.pageData.currentTotal = val.total ? Number(val.total) : 0;
            },
        },
        deep: true,
    },
    methods: {
        // 分页条数切换
        handleSizeChange (val) {
            this.pageData.currentPage = 1;
            this.pageData.currentList = val;
            this.$parent.handleQueryInfo({}, true);
        },
        // 跳转页数切换
        handleCurrentChange (val) {
            this.pageData.currentPage = val;
            this.$parent.handleQueryInfo({}, true);
        },
    },
};
</script>
