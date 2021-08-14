<template>
    <div class="ui-table_config">
        <el-button type="text" size="small" icon="el-icon-setting icon_blue" @click="show = !show">列表配置</el-button>
        <el-drawer
                custom-class="ui-table_config__drawer"
                :with-header="false"
                :visible.sync="show"
                direction="rtl">
            <div class="ui-table_config__body">
                <div class="ui-tip">
                    <span>请勾选需要显示的列</span>
                </div>
                <ul class="ui-config__check">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="checks" @change="handleCheck">
                        <el-checkbox :disabled="value === 'index'" v-for="(label, value) in options" :label="value" :key="value">{{label}}</el-checkbox>
                    </el-checkbox-group>
                </ul>
                <div class="ui-config__button">
                    <el-button size="small" @click="show = !show">取消</el-button>
                    <el-button size="small" type="primary" @click="handleSaveConfig">保存</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    export default {
        name: "ComTableConfig",
        props: {
            tKey: {
                type: Array,
                default() {
                    return []
                }
            },
            tProps: {
                type: Array,
                default() {
                    return []
                }
            },
            options: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                show: false,
                checks: [],
                checkAll: false,
                isIndeterminate: false
            }
        },
        computed: {
            useProps() {
                return Object.keys(this.options);
            }
        },
        methods: {
            // 勾选
            handleCheck(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.useProps.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.useProps.length;
            },

            // 勾选全部
            handleCheckAllChange(val) {
                this.checks = val ? this.useProps : this.useProps.includes('index') ? ['index'] : [];
                this.isIndeterminate = false;
            },

            // 保存配置
            handleSaveConfig() {
                this.$emit('update:tKey', Object.entries(this.options).reduce((temp, [key, value]) => {
                    if (this.checks.includes(key)) return [ ...temp, value];
                    else return temp;
                }, []));

                this.$emit('update:tProps', Object.entries(this.options).reduce((temp, [key]) => {
                    if (this.checks.includes(key)) return [ ...temp, key];
                    else return temp;
                }, []));
                this.show = false;
            }
        },
        watch: {
            show(val) {
                if (val) {
                    this.checks = this.tProps;
                    this.handleCheck(this.tProps);
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-table_config {
        float: right;
    }

    .ui-table_config__body {
        .ui-tip {
            border: 1px solid @base-bdr-color;
            padding: 10px 20px;
            span {
                font-size: 14px;
                font-weight: bold;
            }
        }
    }

    .ui-config__check {
        padding: 10px;
        /deep/ .el-checkbox {
            /*display: block;*/
            width: 50%;
            margin-right: 0;
        }
    }

    /deep/ .ui-table_config__drawer {
        width: 300px!important;
    }

    .ui-config__button {
        position: absolute;
        bottom: 50px;
        right: 100px;
    }
</style>