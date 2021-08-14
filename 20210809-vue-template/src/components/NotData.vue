<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-05 09:26:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\components\NotData.vue
-->
<template>
    <div class="ui-not_data-txt">
        <img src="../assets/image/empty3.png" alt="" />
    </div>
</template>

<script>
export default {
    name: 'NotData',
    // props: ['isNotData'],
    // watch: {
    //     isNotData(val) {
    //         if (val) {
    //             this.$emit('changeState', true)
    //         } else {
    //             this.$emit('changeState', false)
    //         }
    //     }
    // }
};
</script>

<style scoped lang="less">
    .ui-not_data-txt {
        box-sizing: border-box;
        padding-top: 140px;
        line-height: normal;
        p {
            padding-top: 20px;

            /* margin-top: 10px; */
        }
    }
</style>
