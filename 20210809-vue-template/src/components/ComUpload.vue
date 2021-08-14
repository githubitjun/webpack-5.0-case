<style lang="less" scoped>
.elloadingbtn {
    margin-left: 0 !important;
    /deep/ .el-loading-mask {
        background-color: rgba(255, 255, 255, 0.5);
    }
    /deep/ .el-loading-spinner {
        margin-top: -6px;
    }
}
.eluploaddisabled {
    /deep/ .el-upload--picture-card {
        display: none;
    }
}
.imgDialogwrap {
    height: 600px;
    padding: 3px 6px;
    overflow-y: auto;
    border: 1px solid #a9a9a9;
    img {
        max-width: 100%;
    }
}
</style>

<template>
    <div>
        <!-- 粘贴图片按钮 -->
        <el-button
            v-if="onlyImagePaste" type="text"
            :disabled="disabled" @click="openImgDialogFn()">
            粘贴图片
        </el-button>
        <!-- 文件上传组件 -->
        <el-upload
            v-else
            ref="upFile"
            :key="uploadKey"
            :list-type="listType"
            :action="apiUrl"
            :file-list="fileList"
            :name="name"
            :on-success="UpSuccess"
            :on-remove="UpRemove"
            :beforeUpload="beforeUpload"
            :on-preview="UpPreview"
            :limit="limit"
            :on-exceed="overLimitFn"
            :disabled="disabled || fileUploading"
            :http-request="httpRequest"
            :class="{eluploaddisabled: disabled}">
            <template v-if="listType != 'text'">
                <i class="el-icon-plus"></i>
                <el-button
                    v-if="needImagePaste"
                    slot="tip"
                    v-loading="fileUploading" type="text"
                    element-loading-spinner="el-icon-loading" class="elloadingbtn"
                    :disabled="disabled || fileUploading" style=" margin-left: 10px !important; vertical-align: bottom;"
                    @click.stop="openImgDialogFn()">
                    粘贴图片
                </el-button>
            </template>
            <template v-else>
                <el-button
                    v-loading="fileUploading" :type="buttonType"
                    element-loading-spinner="el-icon-loading" class="elloadingbtn"
                    size="mini" :disabled="disabled">
                    {{ btnName }}
                </el-button>&nbsp;&nbsp;&nbsp;
                <el-button
                    v-if="needImagePaste"
                    v-loading="fileUploading" type="text"
                    element-loading-spinner="el-icon-loading" class="elloadingbtn"
                    :disabled="disabled || fileUploading" @click.stop="openImgDialogFn()">
                    粘贴图片
                </el-button>&nbsp;&nbsp;&nbsp;
                <span v-if="!singleFileSize && isShowTips" slot="tip">支持{{ fileType.join('、') }}格式，大小不能超过{{ fileSize }}M</span>
                <span v-if="singleFileSize && isShowTips" slot="tip">支持{{ fileType.join('、') }}格式，单个文件必须小于{{ singleFileSize }}M，所有文件不能超过{{ fileSize }}M</span>
            </template>
        </el-upload>

        <!-- 预览文件 -->
        <PreviewAllFilesDialog ref="PreviewAllFilesDialog" />

        <!-- 粘贴图片上传弹窗 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="粘贴图片"
            top="100px"
            width="1220px"
            :visible.sync="imgDialog.dialog"
            append-to-body
            :close-on-click-modal="false">
            <div
                ref="imgDialogwrap" class="imgDialogwrap"
                contenteditable @paste="imagePasteFn">
            </div>
            <span slot="footer">
                <el-button size="small" @click="imgDialog.dialog = false">取 消</el-button>
                <el-button
                    type="primary" size="small"
                    @click="submitImgFn()">确 认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import {UploadFile} from '@/api/module/kupang_platform/kupang_publish_list'; //
import CONFIG from '@/assets/js/config';
export default {
    name: 'ComUpload',
    props: {
        name: {
            type: String,
            default: 'file',
        },
        apiUrl: {
            type: String,
            default: 'http://rest.java.yibainetwork.com/file/file/upload/batch',
        },
        // 上传组件类型     text/picture/picture-card
        listType: {
            type: String,
            default: 'text',
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            default: false,
        },
        // 按钮名称
        btnName: {
            type: String,
            default: '上传附件',
        },
        // 可以上传文件的个数
        limit: {
            type: Number,
            default: null,
        },
        // 允许上传的文件类型
        fileType: {
            type: Array,
            default () {
                return ['gif', 'jpg', 'png', 'jpeg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'];
            },
        },
        // 总文件最大几M
        fileSize: {
            type: Number,
            default: 8,
        },
        // 单文件最大几M
        singleFileSize: {
            type: Number,
            default: null,
        },
        isShowTips: {
            type: Boolean,
            default: true,
        },
        buttonType: {
            type: String,
            default: 'primary',
        },
        // 是否需要粘贴图片功能
        needImagePaste: {
            type: Boolean,
            default: false,
        },
        // 是否只有粘贴图片的功能
        onlyImagePaste: {
            type: Boolean,
            default: false,
        },
        upSuccessFn: Function,
        upPreviewFn: Function,
        httpRequest: Function,
    },
    data () {
        return {
            fileList: [],
            uploadKey: 1,
            fileUploading: false,

            imgDialog: {
                dialog: false,
                url: '',
                name: '',
                size: '',
            },
        };
    },
    methods: {
        // 外部调用的方法
        // 设置此组件文件列表(数组对象中url为必须)
        setFileList (fileList = []) {
            this.fileList = fileList;
        },
        getFileList () {
            // 返回格式 [{name: 'aa.xxx', url: 'url', size: 666}, ...]
            return this.fileList;
        },

        // 上传文件用到的方法
        UpSuccess (response, file, fileList) {
            if (this.upSuccessFn) {
                this.upSuccessFn(this, response, file, fileList);
            } else {
                this.fileUploading = false;
                if (response.status !== 1) {
                    this.$message.error(response.errorMess || '上传文件失败！');
                    this.uploadKey++;
                    return;
                }
                this.fileList.push({name: file.name, url: file.response.datas.file_path, size: file.size});
            }
        },
        UpRemove (file, fileList) {
            this.fileList = JSON.parse(JSON.stringify(fileList));
        },
        overLimitFn () {
            this.$message.error('最多上传' + this.limit + '个附件！');
        },
        beforeUpload (file) {
            // 格式检查
            const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            if (this.fileType.length && !this.fileType.includes(ext)) {
                this.$message.error('文件格式不符合，应为' + this.fileType.join('、'));
                return false;
            }

            // 当前文件大小检查
            if (this.fileSize != 0) {
                // 单个文件大小
                const singleFileSize = this.singleFileSize ? this.singleFileSize : this.fileSize;
                const singleMaxSize = 1024 * 1024 * singleFileSize;
                const maxSize = 1024 * 1024 * this.fileSize;
                if (file.size > singleMaxSize) {
                    this.$message.error('文件大小必须在' + singleFileSize + 'm以内！');
                    return false;
                }

                // 所有文件大小检查
                const allSize = this.fileList.map((e) => { return e.size; }).reduce((total, currentValue, currentIndex, arr) => {
                    return total + currentValue;
                }, 0);
                if (file.size + allSize > maxSize) {
                    this.$message.error('所有文件大小必须在' + this.fileSize + 'm以内！');
                    return false;
                }
            }

            if (true) {
                this.$emit('getFile', file);
                return false;
            }
            this.fileUploading = true;
        },
        UpPreview (file) {
            if (this.upPreviewFn) {
                this.upPreviewFn(file);
            } else {
                this.$refs.PreviewAllFilesDialog.show(file.url);
            }
        },

        // 粘贴图片弹窗相关
        openImgDialogFn () {
            if (this.limit && this.fileList.length >= this.limit) {
                this.overLimitFn();
                return;
            }
            this.imgDialog = {
                dialog: true,
                url: '',
                name: '',
                size: '',
            };
            this.$nextTick(() => {
                this.$refs.imgDialogwrap.innerHTML = '';
            });
        },
        // 粘贴图片弹窗确定方法
        submitImgFn () {
            if (!this.imgDialog.url) {
                this.$message.error('没有粘贴截图！');
                return;
            }
            const file = {name: this.imgDialog.name, url: this.imgDialog.url, size: this.imgDialog.size};
            this.fileList.push(file);
            this.imgDialog.dialog = false;
            if (this.onlyImagePaste) {
                this.$emit('getImageInfo', file);
            }
        },
        // 粘贴图片上传
        imagePasteFn (e) {
            const cbd = e.clipboardData;

            // 不支持的浏览器 直接 return
            if (!(cbd && cbd.items)) {
                this.$message.error('此浏览器不支持粘贴图片，请使用上传文件功能！');
                return;
            }

            // 检测粘贴操作有效性
            if (!cbd.items.length || cbd.items.length == 4 || !Array.from(cbd.items).some((e) => { return e.kind == 'file'; })) {
                setTimeout(() => {
                    this.$refs.imgDialogwrap.innerHTML = '';
                }, 0);
                this.$message.error('请粘贴有效的截图！');
                return;
            }

            // 找到第一张截图进行上传
            const file = Array.from(cbd.items).find((e) => { return e.kind == 'file'; }).getAsFile();
            if (file.size === 0) {
                this.$message.error('无效的截图！');
                return;
            }

            // 上传文件
            UploadFile(file).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '上传文件失败！');
                    return;
                }
                this.imgDialog.url = data.file_path;
                this.imgDialog.name = '截图' + +new Date() + '.png';
                this.imgDialog.size = file.size;
                this.$refs.imgDialogwrap.innerHTML = `<img src="${this.imagePreviewUrl}${this.imgDialog.url}" />`;
            });
        },
    },
};
</script>
