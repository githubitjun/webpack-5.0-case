<style lang="less" scoped>
.ui-tab-warp {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 12px;
    line-height: 14px;
    color: #333;
    background-color: #fff;
    padding : 0 0 0 10px;
    .ui-tab-item {
        text-align: center;
        cursor: pointer;
        &:hover {
            color: #5197fe;
        }
        .ui-tab-title {
            display: inline-block;
            height: 20px;
            padding: 2px 10px;
        }
    }
    .ui-ative {
        color: #5197fe;
        border-bottom: 2px solid #5197fe;
    }
    /deep/ .el-badge__content {
        height: 15px;
        padding: 0 2px;
        line-height: 15px;
    }
    /deep/ .el-badge__content.is-fixed {
        top: 6px;
        right: 24px;
    }
    .ui-badge-item:last-child .ui-divider {
        display: none;
    }
}
</style>
<!-- 公共tab -->
<template>
    <div class="ui-tab-warp">
        <el-badge
            v-for="(item, index) in $attrs.tabTypeConfig"
            :key="index" :value="item.value"
            class="ui-badge-item">
            <div class="ui-tab-item" @click="handleTabClick(item)">
                <span class="ui-tab-title" :class="currentActive == item.key? 'ui-ative':''">
                    {{ item.name }}
                </span>
                <ComDivide
                    :color="'#DCDFE6'"
                    :height="'1.2em'" :margin="'0'" />
            </div>
        </el-badge>
    </div>
</template>
<script>
export default {
    name: 'CommonTab',
    props: {
        // 页签类型配置
        // tabTypeConfig: {
        //     type: Array,
        //     default () {
        //         return [];
        //     },
        // },
        // // 当前激活的key值
        // activeName: {
        //     type: String,
        //     default: '',
        // },
    },
    data () {
        return {
            currentActive: this.$attrs.activeName,
        };
    },
    methods: {
        handleTabClick (item) {
            this.currentActive = item.key;
            this.$emit('handleTabClick', item);
        },
    },
};
</script>

