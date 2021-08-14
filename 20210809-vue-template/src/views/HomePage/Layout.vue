<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-05 14:17:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\views\HomePage\Layout.vue
-->
<template>
    <div class="ui-main">
        <div class="ui-nav">
            <Navbar />
        </div>
        <div class="ui-content">
            <UserMenu />
            <Main />
        </div>
        <!-- <Loading /> -->
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {
    Main,
    Navbar,
    UserMenu,
} from '@/views/HomePage';
// import Loading from './component/Loading';
import CONFIG from '@/assets/js/config';
// import {
//     getUploadFileAuth,
// } from '@/api/module/kupang_platform/kupang_publish_list';
export default {
    name: 'Layout',
    components: {
        Navbar,
        Main,
        UserMenu,
        // Loading,
    },
    created () {
        // getUploadFileAuth().then(({data}) => {
        //     if (data.status == 1) {
        //         CONFIG.uploadPath = data.data_list.url;
        //         CONFIG.access_token = data.data_list.account_token;
        //     } else {
        //         this.$message.error(data.errorMess || '请求失败');
        //     }
        // });
    },
};
</script>

<style scoped lang="less">
// .ui-nav {
//     background: #002140;
// }
</style>
