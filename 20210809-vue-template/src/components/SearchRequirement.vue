<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-05 15:28:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\components\SearchRequirement.vue
-->
<template>
    <div class="ui-search_require clearFix">
        <label
            v-if="label" class="ui-search_label"
            :style="{ width: width }">{{ label }}</label>
        <div class="ui-search_input" :class="isTwo && 'ui-search_input-two'">
            <slot></slot>
        </div>
    </div>
</template>

<script>
/**
 *  头部查询组件 > 简便头部书写，自适应宽度
 * */
export default {
    name: 'SearchRequirement',
    props: {
        label: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            // default: '98px',
            default: '',
        },
        fixedWidth: {
            type: String,
            default: '',
        },
        isTwo: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            areaWidth: '',
            minWidth: 298,
        };
    },
    mounted () {
        try {
            const areaWidth = (getEleAttr('.ui-search-area').offsetWidth - 390) / 5;
            this.areaWidth = areaWidth > this.minWidth ? areaWidth + 'px' : this.minWidth + 'px';
        } catch (e) {

        }
    },
};
</script>

<style scoped lang="less">
.ui-search_require {
    display: flex;
    align-items: center;
    .ui-search_label {
        box-sizing: border-box;
        display: inline-block;
        // padding-right: 8px;
        margin-right: 5px;
        font-size: 12px;
        line-height: 16px;
        color: #333;
        text-align: right;
        word-break: break-word;
    }
    .ui-search_input {
        flex: 1;
        line-height: 22px;
    }
    .ui-search_input-two {
        .el-input {
            width: 42% !important;
        }
    }
}
</style>
