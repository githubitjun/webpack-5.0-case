<template>
    <div v-if="initTable" :class="className">
        <slot></slot>
        <!--
            :scroll-x="{enabled: true, oSize: 10, gt: 50}"
            :scroll-y="{enabled: true, oSize: 10, gt: 200}"
            scroll-x 是指横向虚拟滚动, gt 是指当大于 n 列是自动触发渲染大数据;
            scroll-y 是指纵向虚拟滚动, gt 是指当大于 n 行是自动触发渲染大数据, oSize 指定每次渲染的数据偏移量，偏移量越大渲染次数就越少，但每次渲染耗时就越久
            注：启用纵向虚拟滚的后不支持列表动态行高
        -->
        <vxe-table
            ref="xTable"
            v-loading="tableLoading"
            :border="border"
            resizable
            highlight-hover-row
            highlight-current-row
            highlight-current-colum
            :height="tableHeight"
            :sort-config="{trigger: 'cell'}"
            :scroll-x="{enabled: true, oSize: 10, gt: 50}"
            :scroll-y="{enabled: true, oSize: 10, gt: 200}"
            :data="tableData"
            size="small"
            @checkbox-all="selectAllEvent"
            @checkbox-change="selectChangeEvent">
            <vxe-table-column
                v-if="isCheck"
                type="checkbox" width="40"
                fixed="left" />
            <vxe-table-column
                v-for="(item, index) in tableConfigList" :key="index"
                :field="item.field"
                :type="item.type"
                :width="item.width ? item.width : ''"
                :min-width="item.minTableWidth ? item.minTableWidth: '80px'"
                :fixed="item.fixed"
                :show-overflow="false"
                header-class-name="ui-add-header-class">
                <!-- 自定义列表表头 -->
                <template slot="header">
                    <slot :tableName="item.title" :name="`__header_${item.field}`">
                        {{ item.title }}
                    </slot>
                </template>
                <!-- 自定义列表内容 -->
                <template slot-scope="scope">
                    <slot
                        :name="item.field" :row="scope.row">
                        <div>
                            {{ item.field === 'index' ? autoAddTableInx(scope.rowIndex ) : scope.row[item.field] }}
                        </div>
                    </slot>
                </template>
            </vxe-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!tableData.length" />
                </div>
            </template>
        </vxe-table>

    </div>
</template>

<script>
// 用例参考文档：https://xuliangzhan_admin.gitee.io/vxe-table/#/table/start/use
/**
     * name: 表格渲染信息
     *
     * params:
     *      className: 自定义类名
     *      border: 边框 true显示完整边框; false|default 默认显示边框; outer 显示外边框; inner 显示内边框; none 去掉所有边框
     *      tableData:  表格数据  [{name: '小白'， sex: '男'}]
     *      tableConfigList: 表格配置 [{field: 'index', title: '序号', width: 60, fixed: 'left'}]  // 列表列太少建议使用minTableWidth
     *      checkbox: 是否可勾选
     *      showSearch:  收缩搜索栏时切换表格高度
     * */
import {autoAddTableInx} from '../services';
import config from '@/assets/js/config';
export default {
    name: 'ComVXETable',
    props: {
        className: {
            type: String,
            default: 'ui-main-module-table',
        },
        border: {
            type: [Boolean, String],
            default: true,
        },
        tableData: {
            type: Array,
            default () {
                return [];
            },
        },
        tableConfigList: {
            type: Array,
            default () {
                return [];
            },
        },
        isCheck: {
            type: Boolean,
            default: true,
        },
        tableLoading: {
            type: Boolean,
            default: false,
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
        // -----------------------
        otherHeight: {
            type: Array,
            default () {
                return [];
            },
        },
        isSetHeight: {
            type: Boolean,
            default: true,
        },
        searchHeight: {
            type: Boolean,
            default: false,
        },
        isrefreshHeight: { // 刷新高度
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
        // 所有勾选事件/取消所有勾选事件
        selectAllEvent ({records}) {
            this.$emit('checked', records);
        },
        // 勾选事件/取消勾选事件
        selectChangeEvent ({records}) {
            this.$emit('checked', records);
        },
        // *****************************
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
        },
    },
};
</script>

<style lang="less" scoped>
/deep/ .vxe-table .vxe-cell {
    white-space: inherit;
}
/deep/ .vxe-table .vxe-body--column, .vxe-table .vxe-footer--column, .vxe-table .vxe-header--column {
    line-height: 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: #333;
}
/deep/ .vxe-header--column {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: #666;
 }
</style>
