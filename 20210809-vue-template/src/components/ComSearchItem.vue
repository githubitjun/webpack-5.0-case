<template>
    <li>
        <div class="ui-search_require clearFix" :style="{ width: areaWidth }">
            <label class="ui-search_label" :style="{ width: labelWidth }">{{ label }}</label>
            <div
                class="ui-search_input" :style="{ marginLeft: labelWidth }"
                :class="isTwo && 'ui-search_input-two'">
                <slot>
                    <div v-if="template === 'input'">
                        <el-input
                            v-model="modelForm" size="small"
                            :placeholder="placeholder"
                            @keyup.enter.native="handleEnterFn" />
                    </div>
                    <div v-else-if="template === 'daterange' || template === 'datetimerange'">
                        <div class="ui-shortcut-date">
                            <el-date-picker
                                v-model="modelForm"
                                clearable
                                class="ui-shortcut-date"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :type="template"
                                :format="format"
                                :value-format="format"
                                :picker-options="shortcutPicker"
                                :size="size"
                                @change="handleDisabledDate" />
                            <!--<el-radio-group v-model="shortcut" @change="handleShortcutDate">-->
                            <!--<el-radio :label="1">今天</el-radio>-->
                            <!--<el-radio :label="7">近1周</el-radio>-->
                            <!--<el-radio :label="14">近2周</el-radio>-->
                            <!--<el-radio :label="30">近1月</el-radio>-->
                            <!--<el-radio :label="60">近2月</el-radio>-->
                            <!--</el-radio-group>-->
                        </div>
                    </div>
                    <el-date-picker
                        v-else-if="template === 'date'"
                        v-model="modelForm"
                        :clearable="clearable"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :size="size"
                        :picker-options="pickerOptions" />
                    <el-cascader
                        v-else-if="template === 'cascader'"
                        v-model="modelForm"
                        v-filter
                        clearable
                        filterable
                        change-on-select
                        :size="size"
                        placeholder="请选择"
                        :props="props"
                        :options="cascaderOption"
                        @change="change" />
                    <!--<el-select v-model="modelForm" :size="size" v-if="template === 'select'" :multiple="multiple" collapse-tags clearable>-->
                    <!--<el-option v-for="(label, value) in options" :label="label" :value="value" :key="value"></el-option>-->
                    <!--</el-select>-->
                    <el-select
                        v-if="template === 'select'" v-model="modelForm"
                        v-filter size="small"
                        :disabled="disabled"
                        clearable
                        :multiple="multiple" collapse-tags
                        filterable
                        placeholder="请选择">
                        <el-option
                            v-for="(item, index) in selectOption"
                            :key="index"
                            :label="item.label"
                            :value="item.value" />
                    </el-select>

                    <!-- 数字选折器 -->
                    <el-select
                        v-if="template === 'numberSelect'" v-model="modelForm"
                        v-filter size="small"
                        :disabled="disabled" clearable
                        filterable
                        placeholder="请选择">
                        <el-option
                            v-for="item in 24"
                            :key="item"
                            :label="item+'小时'"
                            :value="item" />
                    </el-select>
                    <!--单框时间区间-->
                    <el-row v-if="template === 'splitDate'">
                        <el-col :span="11">
                            <el-date-picker
                                v-model="modelForm[0]" :clearable="clearable"
                                type="date" placeholder="选择日期"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions" />
                        </el-col>
                        <el-col :span="2">
                            -
                        </el-col>
                        <el-col :span="11">
                            <el-date-picker
                                v-model="modelForm[1]" :clearable="clearable"
                                type="date" placeholder="选择日期"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions" />
                        </el-col>
                    </el-row>

                    <!--输入区间-->
                    <el-row v-if="template === 'inputInterval'">
                        <el-col :span="11">
                            <el-input
                                v-model="modelForm[0]" size="small"
                                placeholder="请输入" />
                        </el-col>
                        <el-col :span="2">
                            -
                        </el-col>
                        <el-col :span="11">
                            <el-input
                                v-model="modelForm[1]" size="small"
                                placeholder="请输入" />
                        </el-col>
                    </el-row>

                    <!--库位字段-->
                    <div v-else-if="template === 'storePlace'">
                        <el-input
                            v-model="storePlace.cellCode" style="vertical-align: middle;"
                            size="small" readonly>
                            <span
                                slot="append" class="el-icon-search"
                                style="cursor: pointer" @click="$refs.storePlace.handleShow({ cellUseType: '1' })"></span>
                        </el-input>
                        <com-dialog-select ref="storePlace" @confirm="val => { handleOperationConfirm(name, val) }" />
                    </div>

                    <!-- 整数 -->
                    <div v-if="template === 'number'">
                        <el-input
                            v-model.number="modelForm" size="small"
                            :placeholder="placeholder"
                            @input="(val) => {modelForm = Number(val.replace(/\D/g,''));}"
                            @keyup.enter.native="handleEnterFn" />
                    </div>
                </slot>
            </div>
        </div>
    </li>
</template>

<script>

import CONFIG from '../assets/js/config';

/**
     *  头部查询组件 > 简便头部书写，自适应宽度
     * */
export default {
    name: 'ComSearchItem',
    model: {
        prop: 'model',
        event: 'changes',
    },
    props: {

        // 作为特殊类型的区分
        name: {
            type: String,
            default: 'store',
        },

        model: '',
        template: {
            type: String,
            default: 'input',
        },
        label: {
            type: String,
            default: '',
        },
        labelWidth: {
            type: String,
            default: '100px',
        },
        isTwo: {
            type: Boolean,
            default: false,
        },
        props: {
            type: Object,
            default () {
                return {value: 'value', label: 'label', end: 'endTime', start: 'startTime'};
            },
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        options: {
            type: [Array, Object],
            default () {
                return [];
            },
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        pickerOptions: {
            type: Object,
            default () {
                return {};
            },
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        format: {
            type: String,
            default: 'yyyy-MM-dd',
        },
        width: {
            type: String,
            default: 'auto',
        },
        placeholder: {
            type: String,
            default: '请输入',
        },
    },
    data () {
        const handleShortcutDate = (picker, val) => {
            const end = new Date();
            const start = new Date();
            val -= 1;
            start.setTime(start.getTime() - 3600 * 1000 * 24 * val);
            end.setTime(end.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
        };
        return {
            areaWidth: '',
            minWidth: 298,
            modelForm: this.model,
            size: 'small',
            cascaderOption: [],
            shortcut: '',
            storePlace: {
                id: '',
                cellCode: '',
            },
            shortcutPicker: {
                shortcuts: [{
                    text: '今天',
                    onClick (picker) {
                        handleShortcutDate(picker, 1);
                    },
                }, {
                    text: '近1周',
                    onClick (picker) {
                        handleShortcutDate(picker, 7);
                    },
                }, {
                    text: '近2周',
                    onClick (picker) {
                        handleShortcutDate(picker, 14);
                    },
                }, {
                    text: '近1月',
                    onClick (picker) {
                        handleShortcutDate(picker, 30);
                    },
                }],
            },
        };
    },
    computed: {
        selectOption () {
            let tempArr = [];
            if (Array.isArray(this.options) && this.options.length && this.options[0][this.props.label] === undefined) {
                tempArr = this.options.map((item, index) => {
                    return {
                        label: item,
                        value: index,
                    };
                });
            } else if (!Array.isArray(this.options)) {
                tempArr = Object.entries(this.options).map(([value, label]) => {
                    return {
                        label,
                        value,
                    };
                });
            } else {
                const options = [];
                if (!this.options.find((item) => { return item[this.props.label] === '全部'; }) && !this.options.find((item) => { return item[this.props.label] === '所有'; })) {
                    options.push({
                        [this.props.label]: '全部',
                        [this.props.value]: '',
                    });
                }
                options.push(...this.options);
                tempArr = options.map((item, index) => {
                    return {
                        label: item[this.props.label],
                        value: item[this.props.value],
                    };
                });
            }
            return tempArr;
        },
    },
    watch: {
        modelForm (val) {
            if (this.template === 'daterange') {
                this.$emit('changes', val);
            } else {
                this.$emit('changes', val);
            }
            if (!val) {
                this.storePlace.cellCode = '';
            }
        },
        model () {
            this.modelForm = this.model;
        },
    },
    created () {
        if (this.template === 'cascader') {
            setTimeout(() => {
                if (this.options && this.options.length > 0) {
                    this.cascaderOption = [...this.options];
                    this.handleTreeCallBackChange(this.cascaderOption);
                }
            }, 500);
        }
    },
    mounted () {
        this.$nextTick().then(() => {
            if (this.width === 'auto') {
                if (getEleAttr('.ui-search-area')) {
                    const areaWidth = (getEleAttr('.ui-search-area').offsetWidth - 60) / 5;
                    this.areaWidth = (areaWidth || this.minWidth) + 'px';
                }
            } else {
                this.areaWidth = this.width;
            }
        });
    },
    methods: {

        // 重构树形结构
        handleTreeCallBackChange (arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].son_id && arr[i].son_id.length) {
                    this.handleTreeCallBackChange(arr[i].son_id);
                } else {
                    delete arr[i].son_id;
                }
            }
        },
        change (val) {
            this.$emit('change', val);
        },

        // 库位字段处理
        handleOperationConfirm (type, data) {
            this.modelForm = data.id;
            this.storePlace.cellCode = data.cellCode;
        },

        // 回车事件
        handleEnterFn () {
            this.$parent.$parent.handleQueryInfo();
        },

        // 日期选择控制
        handleDisabledDate (date) {
            this.shortcut = '';
            const range = 30 * 3600 * 24 * 1000;
            const max = Math.max(new Date(date[0]).getTime(), new Date(date[1]).getTime());
            const min = Math.min(new Date(date[0]).getTime(), new Date(date[1]).getTime());
            if (max - min > range) {
                this.$emit('changes', ['', '']);
                this.$message.warning('时间范围不能大于一个月！');
            }
        },
    },
};
</script>

<style scoped lang="less">
// 元素宽度自适应
.ui-main-module-search {
    li {
        width: 18% !important;
        .ui-search_require {
            width: 100% !important;
        }
    }
}
    .ui-search_require {
        .ui-search_label {
            display: block;
            float: left;
            height: 36px;
            padding-right: 12px;
            box-sizing: border-box;
            text-align: right;
            font-size: 12px;
            color: #333333;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            line-height: 1.3;
        }

        .ui-search_input {
            line-height: 32px;
            flex: 1;

            .el-select {
                width: 100%;
            }

            /deep/ .el-input--suffix .el-input__inner {
                height: 32px !important;
                line-height: 32px;
            }

        }

        .ui-shortcut-date {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            /deep/ .el-date-editor {
                width: 320px;
            }

            /deep/ .el-radio__label {
                padding-left: 4px;
            }

            /deep/ .el-radio {
                margin-right: 0;
                margin-left: 10px;
            }
        }

        .ui-search_input-two {
            .el-input {
                width: 42% !important;
            }
        }

        .el-cascader {
            width: 100%;
        }
    }

    /deep/.el-row {
        .el-input--prefix .el-input__inner {
            padding-left: 10px!important;
        }
        .el-input--suffix .el-input__inner {
            padding-right: 0!important;
        }
        .el-input__prefix {
            display: none!important;
        }
        .el-input__suffix {
            top: -3px!important;
        }
    }
</style>
