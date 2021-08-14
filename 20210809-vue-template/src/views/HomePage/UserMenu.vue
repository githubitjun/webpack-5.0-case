<!--
 * @Author: your name
 * @Date: 2021-06-04 10:38:27
 * @LastEditTime: 2021-06-04 15:26:07
 * @LastEditors: Please set LastEditors
 * @Description: 头部
 * @FilePath: \dailishang\src\views\HomePage\UserMenu.vue
-->
<template>
    <div class="ui-user-menu">
        <el-dropdown class="ui-user-info">
            <span class="el-dropdown-link">
                <i class="el-icon-user el-icon--right"></i><span>无名氏</span>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
export default {
    methods: {
        handleLoginOut () {},
    },
};
</script>

<style scoped lang="less">
.ui-user-menu {
    width: 100%;
    height: 50px;
    text-align: right;
    // background: #f9f9f9;
    background: #f2f2f2;
    .ui-user-info {
        margin-top: 14px;
        cursor: pointer;
        .el-dropdown-link {
            margin-right: 20px;
        }
        .el-icon-user {
            margin-right: 5px;
            font-size: 22px;
        }
    }
}

</style>
