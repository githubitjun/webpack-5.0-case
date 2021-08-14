<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-05 14:15:00
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\views\HomePage\components\Loading.vue
-->
<template>
    <div class="ui-loading"></div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
    name: 'Loading',
    props: ['loading'],
    data () {
        return {
            loadingData: {},
        };
    },
    computed: {
        ...mapGetters(['showLoading']),
        Loading: function () {
            return this.loading;
        },
    },
    watch: {
        showLoading (val) {
            if (val) {
                this.loadingData = this.$loading({
                    lock: true,
                    text: '',
                    spinner: '',
                    background: 'rgba(0, 0, 0, 0.7)',
                });
            } else {
                this.loadingData.close && this.loadingData.close();
            }
        },
    },
};
</script>

<style scoped>
    .ui-loading {
        background: #333;
        opacity: 0.3;
    }
</style>
