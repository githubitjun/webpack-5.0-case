<style scoped lang="less">

</style>

<template>
    <div>
        <!-- pdf预览 -->
        <ComPreviewPdf ref="ComPreviewPdf" />

        <!-- 图片预览 -->
        <PreviewImg ref="PreviewImg" />
    </div>
</template>

<script>
import ComPreviewPdf from './ComPdfView';
import PreviewImg from './ComLookImg';

export default {
    name: 'PreviewAllFilesDialog',
    components: {
        ComPreviewPdf,
        PreviewImg,
    },
    data () {
        return {
            cb: null,
        };
    },
    methods: {
        show (name, url, cb) {
            this.cb = cb;

            if (!name) {
                return;
            }

            url = url || name;
            if (Array.isArray(name)) {
                this.$refs.PreviewImg.showImg(name);
            } else {
                const getUrl = name.split('?')[0]; // 有些图片路径可能携带参数
                const ext = getUrl.substring(getUrl.lastIndexOf('.') + 1).toLowerCase();
                // 带.pdf后缀的或base64形式的pdf文件
                if (ext == 'pdf' || getUrl.includes('/pdf;base64')) {
                    this.$refs.ComPreviewPdf.show(url);
                } else if (['gif', 'jpg', 'png', 'jpeg', 'bmp'].includes(ext)) {
                    this.$refs.PreviewImg.showImg(url);
                } else {
                    this.$message.warning('此类型文件不支持预览！');
                }
            }
        },
    },
};
</script>
