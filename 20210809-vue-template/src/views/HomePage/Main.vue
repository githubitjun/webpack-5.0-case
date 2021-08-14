<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-05 14:13:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\views\HomePage\Main.vue
-->
<template>
    <section class="s-main">
        <div class="ui-tab-nav">
            <!-- 导航标签 -->
            <MultipleTab />
        </div>
        <keep-alive :include="keepAlive">
            <router-view v-loading="loading" />
        </keep-alive>
    </section>
</template>

<script>
import {mapGetters} from 'vuex';
import MultipleTab from './components/MultipleTab';
export default {
    name: 'Main',
    components: {
        MultipleTab,
    },
    computed: {
        ...mapGetters(['keepAliveLabel', 'loadingParams']),
        key () {
            return this.$route.path !== undefined ? this.$route.path.replace('/', '') : this.$route;
        },
        keepAlive () {
            return this.keepAliveLabel.map((item) => { return item.replace('/', ''); });
        },

        loading () {
            return JSON.parse(this.loadingParams)[this.$route.path];
        },
    },
};
</script>

<style scoped  lang="less">
.s-main {
    height: 100%;
}
.ui-tab-nav {
    display: flex;
    .ui-multiple_tab {
        flex: auto;
        border-right: none;
    }
}
</style>
