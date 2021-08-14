<template>
    <div v-if="initTable" :class="className">
        <slot></slot>
        <el-table
            ref="myTable"
            v-loading="tableLoading"
            :resizable="false"
            :border="border"
            :data="tableData"
            :height="tableHeight"
            :span-method="spanMethod"
            :highlight-current-row="true"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            @row-click="handleRowClick">
            <el-table-column
                v-if="isCheck"
                fixed="left"
                type="selection"
                width="36"
                :selectable="selectable" />

            <template v-if="tableConfigList.length">
                <el-table-column
                    v-for="(item, index) in tableConfigList"
                    :key="index"
                    :sortable="item.sort"
                    :fixed="item.props === 'operate' ? 'right' : item.fixed? item.fixed: false"
                    :type="item.props === 'index' ? 'index' : ''"
                    :prop="item.props"
                    :minWidth='item.minTableWidth? item.minTableWidth: ""'
                    :width="item.width || ''">
                    <template slot="header">
                        <slot :tableName="item.key" :name="`__header_${item.props}`">
                            {{ item.key }}
                        </slot>
                        <!-- <span>{{ item.key }}</span>
                        <el-tooltip
                            v-if="item.tooltip"
                            class="item" effect="dark"
                            :content="item.tooltip" placement="top">
                            <span style="margin-left: 3px; cursor: pointer;"><i class="el-icon-warning"></i></span>
                        </el-tooltip> -->
                    </template>
                    <template slot-scope="scope">
                        <slot
                            :name="item.props" :row="scope.row"
                            :$index="scope.$index">
                            {{ item.props === 'index' ? autoAddTableInx(scope.$index) : scope.row[item.props] }}
                        </slot>
                    </template>
                </el-table-column>
            </template>
            <template v-else>
                <el-table-column
                    v-for="(item, index) in tableKey"
                    :key="index"
                    :sortable="tableSort[index]"
                    :fixed="tableProps[index] === 'operate' ? 'right' : false"
                    :type="tableProps[index] === 'index' ? 'index' : ''"
                    :label="item"
                    :prop="tableProps[index]"
                    :minWidth='minTableWidth[index]? minTableWidth[index]: ""'
                    :width="tableWidth[index] || ''">
                    <template slot="header" slot-scope="scope">
                        <slot :tableName="item" :name="`__header_${tableProps[index]}`">
                            {{ item }}
                        </slot>
                    </template>
                    <template slot-scope="scope">
                        <slot
                            :name="tableProps[index]" :row="scope.row"
                            :$index="scope.$index">
                            {{ tableProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[tableProps[index]] }}
                        </slot>
                    </template>
                </el-table-column>
            </template>

            <template slot="empty">
                <div :key="isSetSearch">
                    <NotData v-if="!tableData.length && isSetSearch" />
                    <!-- 列表未加载时显示内容 -->
                    <!-- <NotSearch
                        v-if="!tableData.length && !isSetSearch" /> -->
                </div>
            </template>
        </el-table>
    </div>
</template>

<script>
/**
     * name: 表格渲染信息
     *
     * params:
     *      tableKey: 表头信息  ['姓名', '性别']
     *      tableData:  表格数据  [{name: '小白'， sex: '男'}]
     *      tableProps:  表格props  ['name', 'sex']
     *      showSearch:  收缩搜索栏时切换表格高度
     *      isCheck:  是否可勾选
     *      otherHeight:  自适应表格高度
     *      border: 是否有边框
     *      className: 自定义类名
     * */
import {autoAddTableInx} from '../services';
import config from '@/assets/js/config';
export default {
    name: 'ComTableInfo',
    props: {
        tableKey: {
            type: Array,
            default () {
                return [];
            },
        },
        tableSort: {
            type: Array,
            default () {
                return [false];
            },
        },
        defaultSort: {
            type: Object,
            default () {
                return {};
            },
        },
        tableData: {
            type: Array,
            default () {
                return [];
            },
        },
        tableProps: {
            type: Array,
            default () {
                return [];
            },
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
        tableWidth: {
            type: Array,
            default () {
                return ['80'];
            },
        },
        minTableWidth: {
            type: Array,
            default () {
                return ['80'];
            },
        },
        isCheck: {
            type: Boolean,
            default: false,
        },
        otherHeight: {
            type: Array,
            default () {
                return [];
            },
        },
        selectable: {
            type: Function,
            default () {
                return () => {};
            },
        },
        border: {
            type: Boolean,
            default: false,
        },
        className: {
            type: String,
            default: 'ui-main-module-table',
        },
        spanMethod: {
            type: Function,
            default () {
                return () => {};
            },
        },
        isSetHeight: {
            type: Boolean,
            default: true,
        },
        sortable: {
            type: Boolean,
            default: false,
        },
        searchHeight: {
            type: Boolean,
            default: false,
        },
        tableLoading: {
            type: Boolean,
            default: false,
        },
        tableConfigList: {
            type: Array,
            default () {
                return [];
            },
        },
        isrefreshHeight: { // 刷新高度
            type: Boolean,
            default: true,
        },
        isSetSearch: { // 是否默认一进页面就加载列表
            type: Boolean,
            default: true,
        },
    },
    data () {
        return {
            initTable: true,
            tableHeight: '100px',
        };
    },
    watch: {
        showSearch (n, o) {
            setTimeout(() => {
                this.handleResizeHeight();
            }, 400);
        },
        // 搜索项加载完设置表格高度
        searchHeight (n) {
            setTimeout(() => {
                this.handleResizeHeight();
            }, 400);
        },
    },
    mounted () {
        // 页面dom加载完设置表格高度
        this.$nextTick().then(() => {
            document.querySelector('body').style.overflow = 'hidden';
            this.tableHeight = this.isSetHeight ? config.setTableHeight('s-main', this.otherHeight, null, this.extraView) : '';
        });
        this.$nextTick().then(() => {
            this.handleRefreshHeight();
        });
        window.addEventListener('resize', this.handleWindowRefresh);
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.handleWindowRefresh);
    },
    // 页签激活设置表格高度
    activated () {
        const vm = this;
        vm.$nextTick().then(() => {
            // console.log('height');
            vm.handleResizeHeight();

            window.onresize = function () {
                if (vm.$refs.myTable) {
                    vm.handleResizeHeight();
                }
            };
        });
    },
    methods: {
        autoAddTableInx,
        // 勾选
        handleSelectionChange (val) {
            this.$emit('checked', val);
        },
        // 排序
        handleSortChange (column) {
            this.$emit('handleSort', column);
        },
        handleResizeHeight () {
            document.querySelector('body').style.overflow = 'hidden';
            this.tableHeight = this.isSetHeight ? config.setTableHeight('s-main', this.otherHeight, null, this.extraView) : '';
            this.$refs.myTable.doLayout(); // 解决列表错位问题
        },
        handleRowClick (row, column, event) {
            if (row) {
                this.$refs.myTable.toggleRowSelection(row);
                this.$emit('handleRowClick', row);
            }
        },

        // 窗口变动
        handleWindowRefresh () {
            document.querySelector('body').style.overflow = 'hidden';
            // 避免频繁触发
            setTimeout(() => {
                this.handleRefreshHeight();
            }, 400);
            document.querySelector('body').style.overflow = '';
        },

        // 刷新table高度
        handleRefreshHeight () {
            if (this.isrefreshHeight) {
                this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
            }
            this.$refs.myTable && this.$refs.myTable.doLayout();
        },
        // 实现隔行变色
        tableRowClassName ({rowIndex}) {
            if (rowIndex % 2 == 0) {
                return 'warning-row';
            } else {
                return 'success-row';
            }
        },
    },
};
</script>

<style lang="less" scoped>

/deep/ .el-loading-text {
    position: absolute;
    bottom: -16px;
    font-size: 12px !important;
}
/deep/ span.el-table__empty-text {
    width: 100%;
}
/deep/.el-table .warning-row {
    background: #fff;
}
/deep/.el-table .success-row {
    background: #fafafa;
}
/deep/.el-table th.is-leaf {
    border-bottom: 0;
}
/deep/.el-table tr td {
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
}
</style>
