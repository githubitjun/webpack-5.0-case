<template>
    <el-dialog
        v-draggable
        class="ui-layout_edit-dialog previewDialog"
        top="8vh"
        title="预览图片"
        width="1000px"
        append-to-body
        :visible.sync="isShow"
        @close="handleClosePreview">
        <div ref="lookImage" class="ui-look_image">
            <div class="ui-look_image--area">
                <img
                    v-for="url in srcList"
                    :key="url"
                    :src="url"
                    style="display: none"
                    @error="$message.error({
                        message: `图片地址链接无效. 查看链接: ${url}`,
                        duration: 5500,
                        showClose: true,
                    })" />
            </div>
        </div>
    </el-dialog>
</template>

<script>
import Viewer from 'viewerjs';

export default {
    name: 'ComLookImg',
    data () {
        return {
            src: '',
            areaObj: {},
            isShow: false,
            defaultUrl: '',
        };
    },
    computed: {
        srcList () {
            return Array.isArray(this.src) ? this.src : [this.src];
        },
    },
    methods: {
        showImg (url) {
            this.src = url;
            this.isShow = true;

            this.$nextTick(() => {
                if (this.areaObj.update) {
                    this.handleLoadImage('change');
                } else {
                    this.handleLoadImage();
                }
                this.refreshLayout();
            });
        },
        show (url) {
            this.src = url;
            this.isShow = true;

            this.$nextTick(() => {
                if (this.areaObj.update) {
                    this.handleLoadImage('change');
                } else {
                    this.handleLoadImage();
                }
                this.refreshLayout();
            });
        },
        handleClosePreview () {
            this.areaObj.index = 0;
        },

        // 加载
        handleLoadImage (type) {
            this.$nextTick().then(() => {
                let lookImageArea;
                const vm = this;
                if (type === 'change') {
                    lookImageArea = this.$refs.lookImage.querySelectorAll('.ui-look_image--area img');
                    this.areaObj.update(lookImageArea, {
                        inline: true,
                        // toolbar: false,
                        viewed: function () {
                            // console.log('change');
                            document.querySelector('.viewer-play').style.display = 'none';
                            document.querySelector('.viewer-prev').style.display = 'block';
                            document.querySelector('.viewer-next').style.display = 'block';
                        },
                    });
                    vm.areaObj.reset();
                } else {
                    lookImageArea = this.$refs.lookImage.querySelector('.ui-look_image--area');
                    this.areaObj = new Viewer(lookImageArea, {
                        inline: true,
                        // toolbar: false,
                        // url: 'src',
                        viewed: function () {
                            // vm.areaObj.zoomTo(1);
                            document.querySelector('.viewer-play').style.display = 'none';
                            document.querySelector('.viewer-prev').style.display = 'block';
                            document.querySelector('.viewer-next').style.display = 'block';
                        },
                    });
                }
            });
        },

        refreshLayout () {
            const dialogWrap = this.$el;
            const dialog = dialogWrap.getElementsByClassName('el-dialog')[0];
            dialog.style.right = '0px';
            dialog.style.left = '0px';
            dialog.style.margin = '8vh auto';
            dialog.style.top = '0px';
        },
    },
};
</script>

<style scoped lang="less">
.ui-look_image {
    width: 100%;
    height: 600px;
    overflow: hidden;
    .ui-look_image--area {
        height: 600px;
        transition: all linear 0.1s;
    }
}
.ui-look_image--oper {
    height: 50px;
    line-height: 50px;
    text-align: center;
    span {
        cursor: pointer;
        &:hover {
            color: #5980fc;
        }
    }
}
</style>
