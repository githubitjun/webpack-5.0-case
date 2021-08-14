<template>
    <div class="ui-default_template" :style="{height: height, backgroundColor: color}" :class="className">
        <slot></slot>
    </div>
</template>

<script>
    import { countTableHeight } from '../services'
    export default {
        name: "TemplateDefault",
        props: {
            className: {
                type: String,
                default: ''
            },
            color: {
                type: String,
                default: 'none'
            },
            static: {
                type: Array,
                default() {
                    return []
                }
            },
            staticNum: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                height: ''
            }
        },
        methods: {
            handleSetHeight() {
                this.$nextTick().then(() => {
                    this.height = `${countTableHeight('ui-default_template', [], true)}px`;
                });
            }
        },
        mounted() {
            this.handleSetHeight();
            window.addEventListener('resize', this.handleSetHeight);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.handleSetHeight);
        }
    }
</script>

<style scoped>
    .ui-default_template {
        overflow: auto;
    }
</style>