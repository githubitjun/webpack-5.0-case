<style lang="less" scoped>
    .ui-input-number {
        display: flex;
        .el-input-number--small {
            width: 100%!important;
            /deep/.el-input__inner {
                padding: 0 15px!important;
            }
            /deep/.el-input-number__increase, /deep/.el-input-number__decrease {
                display: none!important;
            }
        }
    }
</style>
<template>
    <div class="ui-input-number">
        <el-input-number
            v-model="num1"
            controls-position="right"
            :min="0"
            placeholder="请输入数字"
            size="small"
            :precision="precision" @change="handleChange" />&nbsp-&nbsp
        <el-input-number
            v-model="num2"
            controls-position="right"
            :min="0"
            placeholder="请输入数字"
            size="small"
            :precision="precision" @change="handleChange" />
    </div>
</template>
<script>
export default {
    name: 'InputRangeNumber',
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        value: Array,
        precision: Number,
    },
    data () {
        return {
            num1: this.value === null || this.value === undefined ? undefined : this.value.length ? this.value[0] : undefined,
            num2: this.value === null || this.value === undefined ? undefined : this.value.length ? this.value[1] : undefined,

        };
    },
    watch: {
        value: {
            handler (val) {
                this.handleSetData();
            },
        },
        deep: true,
    },
    methods: {
        handleChange (val) {
            this.$emit('change', [this.num1, this.num2]);
        },
        handleSetData () {
            this.num1 = this.value === null || this.value === undefined ? undefined : this.value.length ? this.value[0] : undefined;
            this.num2 = this.value === null || this.value === undefined ? undefined : this.value.length ? this.value[1] : undefined;
            if (this.value && this.value.length > 1 && this.value[1] < this.value[0]) {
                this.num1 = undefined;
                this.$message.error('最大值不能小于最小值');
            }
        },
    },
};
</script>
