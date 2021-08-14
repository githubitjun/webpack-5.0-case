<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-03 16:42:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\components\ComSearchButton.vue
-->
<template>
    <div>
    </div>
</template>

<script>
import CONFIG from '@/assets/js/config';
export default {
    components: {
    },
    computed: {
        wishIsShow: function () {
            return CONFIG.COM_SEARCH_WISH.some((item) => {
                return this.$route.path == item;
            });
        },
        allegroIsShow: function () {
            return CONFIG.COM_SEARCH_ALLEGRO.some((item) => {
                return this.$route.path == item;
            });
        },
    },
};
</script>

<style>

</style>
