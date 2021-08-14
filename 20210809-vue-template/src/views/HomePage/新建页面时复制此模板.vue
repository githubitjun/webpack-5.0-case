<!--
 * @Author: your name
 * @Date: 2021-06-05 15:15:20
 * @LastEditTime: 2021-06-05 15:18:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\views\HomePage\MerchantManagement\新建页面时复制此模板.vue
-->
<template>
    <div class="ui-main-module">
        <!-- 查询参数 -->
        <transition name="slide-fade">
            <div v-show="showSearch" class="ui-search-area">
                <ComSearchCondition
                    :componentName="$options.name" @handleQueryInfo="handleQueryInfo($event, false)"
                    @handleResetQueryInfo="handleResetQueryInfo" @handleLoadOk="searchHeight = !searchHeight" />
            </div>
        </transition>
        <!-- 操作按钮 -->
        <div class="ui-fn-module">
            <!-- 操作按钮列表 -->
            <div class="ui-option_b">
                <div class="ui-option_button ui-left-operate-module">
                    <span v-for="item in optionListLabel.batchEditArr" :key="item.id">
                        <el-button
                            v-if="buttonList[item.permit].permit(thisVm)" type="primary"
                            @click="batchEditFn(item.permit)">
                            {{ item.name }}
                        </el-button>
                    </span>
                </div>
            </div>
        </div>
        <!-- 主体表格 -->
        <ComTableInfo
            isCheck
            :tableConfigList="tableConfigList"
            :tableData="tableData"
            :showSearch="showSearch"
            :searchHeight="searchHeight"
            :tableLoading="tableLoading"
            @checked="handleSaveCheckInfo">
            <template slot="operation" slot-scope="{ row }">
                <!-- <el-button
                    v-if="buttonList['download'].permit(thisVm)"
                    type="text" size="small"
                    @click.stop="() => handelDownExport(row)">
                    下载
                </el-button>
                <el-button
                    v-if="buttonList['showLog'].permit(thisVm)"
                    type="text" size="small"
                    @click.stop="() => handelShowlog(row)">
                    日志
                </el-button> -->
            </template>
        </ComTableInfo>
        <!-- 分页 -->
        <ComPageConfig
            ref="ComPageConfig" :pageAllData="pageAllData"
            :pageSize="20" :pageDisabled="pageDisabled" />

    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import CONFIG from '@/assets/js/config';
export default {
    name: 'MerchantList',
    components: {},
    data () {
        return {
            thisVm: this,
            searchHeight: false,
            showSearch: true,
            pageAllData: {}, // 列表返回total集合

            // 查询数据存vuex的key值   不可与其他页面重复
            queryParamsIInfoKey: 'MerchantList',

            // 表格数据
            tableConfigList: [
                {key: '序号', props: 'index', width: '50'},
                {key: '文件名称', props: 'export_name', minTableWidth: '200'},
                {key: '导出类型', props: 'export_type', width: '130'},
                {key: '任务创建时间', props: 'create_time', width: '150'},
                {key: '数据生成时间', props: 'data_create_time', width: '150'},
                {key: '数据生成状态', props: 'status', width: '130'},
                {key: '导出条数', props: 'task_count', width: '100'},
                {key: '实际导出条数', props: 'export_count', width: '100'},
                {key: '创建者', props: 'create_user_id', width: '130'},
                {key: '下载次数', props: 'down_count', width: '100'},
                {key: '操作', props: 'operation', width: '100'},
            ],
            tableData: [],
            // 表格加载动画
            tableLoading: false,
            // 查询数据
            queryData: {

            },
            // 操作按钮配置
            optionListLabel: {
                batchEditArr: [
                    // {name: '新建商户', permit: 'add'},
                    // {name: '导出', permit: 'export'},
                ],
            },

            // 保存选中项信息
            saveCheckInfo: [],
            // 选中的表格项id
            saveCheckIds: '',
            pageDisabled: true, // 分页是否禁用
        };
    },
    computed: {
        ...mapGetters(['queryParamsInfo']),
        buttonList () {
            return CONFIG.buttonList[this.$options.name].buttonList;
        },
    },
    methods: {
        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo (params = {}, isSave) {
            this.queryData.mainQuery = {...params};
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo[this.queryParamsInfoKey]);
            }
            let obj = {
                // 其他附加查询参数

            };

            // 组合查询数据
            obj = {...this.queryData.mainQuery, ...obj};

            // 组合分页数据
            obj = {
                ...obj,
                offset: isSave ? this.$refs.ComPageConfig.pageData.currentPage : 1,     // 不取缓存就要重置页数
                limit: this.$refs.ComPageConfig.pageData.currentList,
            };

            this.tableLoading = true;
            this.pageDisabled = true;
            getList(obj).then(({data}) => {
                this.tableLoading = false;
                this.handleQueryInfoCallBack(data);
            }).catch(() => {
            }).finally(() => {
                this.tableLoading = false;
                this.pageDisabled = false;
            });
        },
        // 查询回调
        handleQueryInfoCallBack (data) {
            // 保存查询参数数据
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: this.queryParamsInfoKey,
                value: JSON.stringify(this.queryData),
            });
            // 状态不为1时处理
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '操作失败！');
                // 清空数据
                data = {
                    data_list: {
                        value: [],
                        page_data: {},
                    },
                };
            }

            // 填充表格数据
            this.tableData = data.data_list.value;
            this.pageAllData = data.data_list.page_data;

            // 重置表格高度
            this.searchHeight = !this.searchHeight;
        },
        // 重置
        handleResetQueryInfo () {
            this.queryData = {
                mainQuery: {},
            };
        },
        // 保存勾选信息
        handleSaveCheckInfo (val) {
            this.saveCheckInfo = val;
            this.saveCheckIds = [...new Set(this.saveCheckInfo.map((e) => { return e.id; }))].join(',');
        },
        // 批量操作
        batchEditFn (permit) {
            if (permit in this) { this[permit](); }
        },
        // 添加
        add () {
            console.log(11);
        },
    },
};
</script>
<style lang="less" scoped>

</style>

