<!--
 * @Author: your name
 * @Date: 2021-06-03 16:21:51
 * @LastEditTime: 2021-06-04 18:30:13
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \dailishang\src\views\NotAuthority.vue
-->
<template>
    <div class="ui-not_authority" :style="{ height: initHeight + 'px' }">
        <div class="ui-not_authority-txt">
            <img src="../assets/image/empty2.png" alt="" />
            <p>无访问权限</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotAuthority',
    data () {
        return {
            initHeight: 600,
        };
    },
    mounted () {
        this.initHeight = window.innerHeight - 70;
    },
};
</script>

<style scoped lang="less">
    .ui-not_authority {
        position: relative;
        .ui-not_authority-txt {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -133px;
            margin-left: -133px;
            color: #666;
            text-align: center;
            p {
                margin-top: 10px;
            }
        }
    }
</style>
