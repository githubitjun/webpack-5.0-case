<template>
    <div>
        <div :class="[className, {'ui-noHover': noHoverCss}]">
            <slot></slot>
            <el-table
                v-if="tableType === 'default'"
                ref="myTable"
                tooltip-effect="light"
                :highlight-current-row="highlightRow"
                :border="border"
                :data="tableData"
                :height="tableHeight"
                :span-method="spanMethod"
                :row-class-name="rowClassFn"
                @current-change="handleSingleCheck"
                @selection-change="handleSelectionChange"
                @expand-change="handleOpenChange">
                <el-table-column
                    v-if="isCheck"
                    type="selection"
                    width="35"
                    :selectable="selectable" />
                <el-table-column
                    v-for="(item, index) in setTitle"
                    :key="index"
                    :type="setProps[index] === 'index' ? 'index' : ''"
                    :fixed="tableFixed.includes(setProps[index]) ? 'right' : false"
                    :show-overflow-tooltip="tooltip.includes(setProps[index])"
                    :label="item"
                    :prop="setProps[index]"
                    :width="setProps[index] === 'index' ? '50px' : (setColWidth[index] || '')"
                    :minWidth="minWidth[index] || ''">
                    <template slot="header" slot-scope="scope">
                        <slot
                            :name="tableProps[index]+'Title'" :row="item"
                            :$index="scope.$index">
                            <span>{{ item }}</span>
                        </slot>
                    </template>
                    <template slot-scope="scope">
                        <slot
                            :name="setProps[index]" :row="scope.row"
                            :$index="scope.$index">
                            <com-state :label="setProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[tableProps[index]]" />
                        </slot>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="operation"
                    label="操作">
                    <template slot-scope="scope">
                        <slot name="operation" :row="scope.row"></slot>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <div v-if="!autoHeight">
                        <NotData v-show="!tableData.length" />
                    </div>
                </template>
            </el-table>
        </div>
        <div v-if="page" class="ui-main-module-page display">
            <el-pagination
                :current-page="pageData.currentPage"
                :page-sizes="pageSizes"
                :page-size="pageData.currentList"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.currentTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
            <div v-if="summary" class="display">
                <p
                    v-for="(item,index) in summaryData" :key="index"
                    style="margin-left:25px;font-size:16px;">
                    {{ item.label }}:<em style="color:red;">{{ item.value }}</em>
                </p>
            </div>
        </div>
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
     *      operation：操作
     * */
import {autoAddTableInx, countTableHeight} from '../services';
import CONFIG from '@/assets/js/config';
export default {
    name: 'ComTable',
    props: {
        tableType: {
            type: String,
            default: 'default',
        },
        tableKey: {
            type: Array,
            default () {
                return [];
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
        // 固定列
        tableFixed: {
            type: Array,
            default () {
                return [false];
            },
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
        tableWidth: {
            type: [Array, Object],
            default () {
                return [];
            },
        },
        isCheck: {
            type: Boolean,
            default: false,
        },
        operation: {
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
            default: true,
        },
        stripe: {
            type: Boolean,
            default: true,
        },
        className: {
            type: String,
            default: 'ui-main-module-table',
        },
        tableSpan: {
            type: Boolean,
            default: false,
        },
        noHoverCss: {
            type: Boolean,
            default: false,
        },
        spanMethod: {
            type: Function,
            default () {
                return () => {};
            },
        },
        autoHeight: {
            type: Boolean,
            default: false,
        },

        // 设置表格高度
        height: {
            type: String,
            default: '',
        },

        minWidth: {
            type: Array,
            default () {
                return ['60'];
            },
        },

        highlightRow: {
            type: Boolean,
            default: true,
        },

        extraView: {
            type: String,
            default: '',
        },

        page: {
            type: Boolean,
            default: true,
        },
        pageData: {
            type: Object,
            default () {
                return {};
            },
        },
        // 是否显示汇总
        summary: {
            type: Boolean,
            default: false,
        },
        summaryData: {
            type: Array,
            default () {
                return [];
            },
        },

        // key => value
        keyProps: {
            type: Object,
            default () {
                return {};
            },
        },

        //
        tooltip: {
            type: [Array, Object],
            default () {
                return [];
            },
        },

        // 控制行样式
        rowClassFn: {
            type: Function,
            default () {
                return '';
            },
        },
    },
    data () {
        return {
            tableHeight: '100px',
            pageSizes: CONFIG.DEFAULT_PAGE_SIZES,
        };
    },
    computed: {
        setColWidth () {
            return Array.isArray(this.tableWidth) ? this.tableWidth : this.setProps.map((item) => { return this.tableWidth[item] || ''; });
        },
        setTitle () {
            return JSON.stringify(this.keyProps) === '{}' ? this.tableKey : Object.values(this.keyProps);
        },
        setProps () {
            return JSON.stringify(this.keyProps) === '{}' ? this.tableProps : Object.keys(this.keyProps);
        },
    },
    mounted () {
        this.$nextTick().then(() => {
            this.handleRefreshHeight();
        });
        window.addEventListener('resize', this.handleWindowRefresh);
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.handleWindowRefresh);
    },
    methods: {
        autoAddTableInx,

        // 勾选
        handleSelectionChange (val) {
            this.$emit('checked', val);
        },

        // 展开表格
        handleOpenChange (row) {
            this.handleRefreshHeight();
        },

        // 分页条数切换
        handleSizeChange (val) {
            this.$emit('pageSizeChange', val);
        },
        // 分页页码切换
        handleCurrentChange (val) {
            this.$emit('pageChange', val);
        },

        // 单选表格
        handleSingleCheck (val) {
            this.$emit('changRow', val);
        },

        // 设置高亮行
        handleSetHighRow (row) {
            this.$refs.myTable.setCurrentRow(row);
        },

        // 点击搜索框隐藏刷新表格
        handleSearchChange () {
            document.querySelector('body').style.overflow = 'hidden';
            setTimeout(() => {
                this.handleRefreshHeight();
                document.querySelector('body').style.overflow = '';
            }, 400);
        },

        // 窗口变动
        handleWindowRefresh () {
            document.querySelector('body').style.overflow = 'hidden';
            this.handleRefreshHeight();
            document.querySelector('body').style.overflow = '';
        },

        // 刷新高度
        handleRefreshHeight () {
            if (this.autoHeight) { return this.tableHeight = ''; }
            if (this.height) {
                this.tableHeight = this.height;
            } else {
                this.tableHeight = countTableHeight('ui-main-module', this.otherHeight) - 10;
            }

            this.$refs.myTable && this.$refs.myTable.doLayout();
        },
    },
};
</script>

<style scoped lang="less">
    .display{
        display: flex;
        align-items: center;
    }
    /deep/ .ui-layout-ceil {
        /*vertical-align: text-top;*/
    }
    /deep/ .sku_highlight {
        background: #fcf2d3;
    }
    /deep/ .bd_highlight {
        background: #fddbe2;
    }

    /deep/ .el-table__empty-block {
        width: 100% !important;
    }

    /deep/ .el-table__body tr.ui-success--row > td {
        background: #90e268!important;
    }
</style>
