<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-04 18:30:04
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\App.vue
-->
<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App',
};
</script>

<style>
    body {
        padding: 0;
        margin: 0;
    }

    /* 解决表头错位 */
    body .el-table th.gutter {
        display: table-cell !important;
    }
    body .el-table colgroup.gutter {
        display: table-cell !important;
    }
    #app {
        height: 100%;
        font-family: '微软雅黑';
        color: #2c3e50;
        text-align: center;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
