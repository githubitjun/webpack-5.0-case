<template>
    <el-dialog
            class="ui-layout_edit-dialog"
            custom-class="ui-com_edit"
            append-to-body
            :destroy-on-close="destroyOnClose"
            :before-close="beforeClose"
            :top="top"
            :title="title"
            :width="width"
            :close-on-press-escape="closeOnPressEscape"
            :close-on-click-modal="closeOnClickModal"
            :visible="visible"
            @close="handleClose">
        <slot></slot>
        <div slot="footer" class="ui-com_edit--btn">
            <slot name="footer"></slot>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "ComDialog",
        props: {
            title: {
                type: String,
                default: '标题'
            },
            width: {
                type: String,
                default: '1000px'
            },
            visible: {
                type: Boolean,
                default: false
            },
            closeOnClickModal: {
                type: Boolean,
                default: false
            },
            closeOnPressEscape: {
                type: Boolean,
                default: false
            },
            top: {
                type: String,
                default: '5vh'
            },
            beforeClose: {
                type: Function,
                default(done) {
                    done();
                }
            },
            destroyOnClose: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handleClose(val) {
                this.$emit('close', val);
                this.$emit('update:visible', false);
            }
        }
    }
</script>

<style scoped>

</style>