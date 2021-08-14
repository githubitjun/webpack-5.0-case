<template>
    <el-dialog :visible="visible" top="5vh" @close="handleClose">
        <pdf-viewer v-if="src" style="width: 100%;"
                    :src="src"
                    :page="pageData.currentPage"
                    @num-pages="pageData.total = $event"
                    @page-loaded="pageData.currentPage = $event"
                    @loaded="loadPdfHandler()"></pdf-viewer>
        <div class="ui-pdf__page clearFix" v-if="pageData.total > 1">
            <span @click="changePdfPage(0)" :class="pageData.currentPage == 1 ? '' : 'ui-link'">上一页</span>
            <span>{{pageData.currentPage + '/' + pageData.total}}</span>
            <span @click="changePdfPage(1)" :class="pageData.currentPage == pageData.total ? '' : 'ui-link'">下一页</span>
        </div>
    </el-dialog>
</template>
<script>
    import pdfViewer from 'vue-pdf'
    export default{
        components: {
            pdfViewer
        },
        name: 'ComPdfView',
        props: {
            src: {
                type: String,
                default: '',
            },
            visible: {
                type: Boolean,
                default: false
            },
        },

        data(){
            return {
                pageData: {
                    currentPage: 0,
                    total: 0,
                }
            }
        },
        computed: {},
        methods: {

            handleClose() {
                this.pageData.currentPage = 1;
                this.$emit('update:visible', false);
            },

            changePdfPage (val) {
                if (val === 0 && this.pageData.currentPage > 1) {
                    this.pageData.currentPage--
                }
                if (val === 1 && this.pageData.currentPage < this.pageData.total) {
                    this.pageData.currentPage++
                }
            },

            loadPdfHandler() {
                this.pageData.currentPage = 1;
            }
        },
        created() {

        }
    }
</script>
<style scoped lang="less">

    .ui-pdf__page span{
        font-size: 12px;
        padding: 0 20px;
        color: #626879;
    }
    .ui-pdf__page span.ui-link {
        color: #3c8cff;
        cursor: pointer;
    }
</style>
