<template>
    <i :class="'bg-' + name" @click="handleClick"></i>
</template>

<script>
export default {
    name: 'ComIcon',
    props: {
        name: {
            type: String,
            default () {
                return '';
            },
        },
    },
    methods: {
        handleClick () {
            this.$emit('click');
        },
    },
};
</script>

<style scoped lang="less">


    .bg-add {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -255px -120px;
    }

    .bg-add_to {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -175px -120px;
    }

    .bg-disabled {
        width: 32px; height: 20px;
        background: url('../assets/image/icon_sum.png') -227px -40px;
    }

    .bg-calendar {
        width: 19px; height: 17px;
        background: url('../assets/image/icon_sum.png') -50px -174px;
    }

    .bg-check {
        width: 14px; height: 14px;
        background: url('../assets/image/icon_sum.png') -295px -120px;
    }

    .bg-delete2 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -215px -120px;
    }

    .bg-delete {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -215px -80px;
    }

    .bg-delete3 {
        width: 14px; height: 14px;
        background: url('../assets/image/icon_sum.png') -295px -80px;
    }

    .bg-start {
        width: 32px; height: 20px;
        background: url('../assets/image/icon_sum.png') -175px -40px;
    }

    .bg-drop_down {
        width: 12px; height: 7px;
        background: url('../assets/image/icon_sum.png') -220px -174px;
    }

    .bg-editor {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -255px -80px;
    }

    .bg-failure {
        width: 20px; height: 19px;
        background: url('../assets/image/icon_sum.png') -135px -69px;
    }

    .bg-logo {
        width: 145px; height: 39px;
        background: url('../assets/image/icon_sum.png') -10px -10px;
    }

    .bg-open {
        width: 13px; height: 7px;
        background: url('../assets/image/icon_sum.png') -187px -174px;
    }

    .bg-pack_up {
        width: 7px; height: 13px;
        background: url('../assets/image/icon_sum.png') -160px -174px;
    }

    .bg-people {
        width: 16px; height: 16px;
        background: url('../assets/image/icon_sum.png') -95px -108px;
    }

    .bg-picture {
        width: 65px; height: 55px;
        background: url('../assets/image/icon_sum.png') -10px -69px;
    }

    .bg-preview {
        width: 23px; height: 20px;
        background: url('../assets/image/icon_sum.png') -279px -40px;
    }

    .bg-preview2 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -175px -80px;
    }

    .bg-selected {
        width: 16px; height: 16px;
        background: url('../assets/image/icon_sum.png') -131px -108px;
    }

    .bg-successful {
        width: 20px; height: 19px;
        background: url('../assets/image/icon_sum.png') -95px -69px;
    }

    .bg-uncheck {
        width: 16px; height: 16px;
        background: url('../assets/image/icon_sum.png') -89px -174px;
    }

    .bg-update {
        width: 20px; height: 19px;
        background: url('../assets/image/icon_sum.png') -10px -174px;
    }

    .bg-upload {
        width: 15px; height: 15px;
        background: url('../assets/image/icon_sum.png') -125px -174px;
    }

    .bg-icon_add {
        width: 15px; height: 15px;
        background: url('../assets/image/icon_add.png') -15px -15px;
    }

    .bg-icon_del {
        width: 15px; height: 15px;
        background: url('../assets/image/icon_del.png') -15px -15px;
    }

    .bg-shrink_down {
        width: 78px; height: 10px;
        background: url('../assets/image/shrink.png') -10px -10px;
    }

    .bg-shrink_up {
        width: 78px; height: 10px;
        background: url('../assets/image/shrink.png') -10px -40px;
    }

    i {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
    }
</style>
