<template>
    <div class="ui-divider" :style="{background: color, height: height, margin: margin}"></div>
</template>

<script>
export default {
    name: 'ComDivide',
    props: {
        color: {
            type: String,
            default: '',
        },
        height: {
            type: String,
            default: '.9em',
        },
        margin: {
            type: String,
            default: '0 8px ',
        },
    },
};
</script>

<style scoped>
    .ui-divider {
        margin: 0 8px;
        display: inline-block;
        height: .9em;
        width: 1px;
        vertical-align: middle;
        position: relative;
        top: -.06em;
        background: #409EFF;
    }
</style>
