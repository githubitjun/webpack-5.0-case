<template functional>
    <div class="ui-not_search-img">
        <!-- <img src="../assets/image/no_search_img.png" alt="" /> -->
    </div>
</template>

<script>
export default {
    name: 'NotSearch',
};
</script>

<style scoped lang="less">
    .ui-not_search-img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: url(../assets/image/no_search.png) no-repeat;
        // background-size: 100% 100%;
    }
</style>
<style lang="less">
.el-table__empty-text {
    width: 100%;
    height: 100%;
    div {
        width: 100%;
        height: 100%;
    }
}
</style>
