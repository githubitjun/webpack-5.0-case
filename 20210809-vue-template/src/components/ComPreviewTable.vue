<template>
    <div class="ui-main-module-table" style="padding: 0 !important;">
        <el-table
            ref="multipleTable"
            v-loading="tableLoading"
            v-bind="$attrs"
            border
            :data="logData"
            :height="isAdaptiveHeight ? null : tableHeight"
            :show-summary="showSummary"
            :summary-method="summaryMethod"
            :span-method="spanMethod"
            :show-header="showHeader"
            @selection-change="$emit('checked', $event)">
            <el-table-column
                v-if="isCheck"
                fixed="left"
                type="selection"
                width="50" />

            <el-table-column
                v-for="(item, index) in tableConfigList"
                :key="index"
                :type="item.props === 'index' ? 'index' : ''"
                :label="item.key"
                :prop="item.props"
                :width="item.width || ''">
                <template slot="header" slot-scope="scope">
                    <slot :tableName="item.key" :name="`__header_${item.props}`">
                        {{ item.key }}
                    </slot>
                </template>

                <template slot-scope="scope">
                    <slot
                        :name="item.props" :row="scope.row"
                        :$index="scope.$index">
                        {{ item.props === 'index' ? autoAddTableInx(scope.$index) : scope.row[item.props] }}
                    </slot>
                </template>
            </el-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!logData.length" />
                </div>
            </template>
        </el-table>
    </div>
</template>

<script>
import {autoAddTableInx} from '../services';

export default {
    name: 'ComPreviewTable',
    props: {
        logData: {
            type: Array,
            default () {
                return [];
            },
        },
        isCheck: {
            type: Boolean,
            default: false,
        },
        isAdaptiveHeight: {
            type: Boolean,
            default: false,
        },
        tableHeight: {
            type: Number,
            default: 500,
        },
        selectable: {
            type: Function,
            default () {
                // eslint-disable-next-line no-empty-function
                return () => {};
            },
        },
        showSummary: {
            type: Boolean,
            default: false,
        },
        summaryMethod: {
            type: Function,
            default () {
                return () => {};
            },
        },
        spanMethod: {
            type: Function,
            default () {
                return () => {};
            },
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
        showHeader: { // 是否显示表头
            type: Boolean,
            default: true,
        },
    },
    data () {
        return {

        };
    },
    mounted () {
    },
    methods: {
        autoAddTableInx,
        handleMultipleTable (val) {
            this.$refs.multipleTable.toggleRowSelection(val);
        },
    },
};
</script>

<style  lang="less" scoped>
</style>
