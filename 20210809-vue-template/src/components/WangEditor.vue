<template>
    <div class="ui-wang_editor">
        <div ref="wangEditor"></div>
    </div>
</template>

<script>
    import wangeditor from 'wangeditor';
    export default {
        name: "WangEditor",
        props: {
            isDisabled: {
                type: Boolean,
                default: false
            },
//            style: {
//                type: Object,
//                default() {
//                    return {}
//                }
//            },
            content: {
                type: String,
                default: ''
            },
            appendContent: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                editorObj: {},
                editing: false,
                timeout: ''
            }
        },
        mounted() {
            const editor = new wangeditor(this.$refs['wangEditor']);

            // 自定义菜单配置
            editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
//                'link',  // 插入链接
                'justify',  // 对齐方式
               'image',  // 插入图片
            ];
            // editor.customConfig.uploadImgServer = '/upload';
            editor.customConfig.customUploadImg = function (files, insert) {
                // files 是 input 中选中的文件列表
                // insert 是获取图片 url 后，插入到编辑器的方法
                //
                let reader = new FileReader();
                reader.onload = (function (file) {
                    return function (e) {
                        insert(this.result);
                        console.log(); //这个就是base64的数据了
                    };
                })(files[0]);
                reader.readAsDataURL(files[0]);
            };

            let vm = this;
            editor.customConfig.onchange = (html) => {

                // 控制编辑时不实时刷新编辑器内容，避免重复刷新光标错闪
                clearTimeout(this.timeout);
                this.editing = true;
                this.timeout = setTimeout(() => {
                    this.editing = false;
                }, 200)
                vm.$emit('getVal', html);
            };
            editor.create();
            this.editorObj = editor;

            if (this.content) {
                this.$nextTick().then(() => {
                    this.handleSetValue(this.content)
                })
            }
        },
        methods: {
            handleSetValue(val) {
                this.editorObj.txt.html(val);
            },
            handleChangeState(val) {
                this.editorObj.$textElem.attr('contenteditable', val)
            }
        },
        watch: {
            /*isDisabled(val) {
                console.log(val);
                this.editorObj.$textElem.attr('contenteditable', !val)
            }*/

            content(val) {
                if (!this.editing) {
                    this.handleSetValue(val);
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .ui-wang_editor {
        text-align: left;
    }
    /deep/.w-e-text-container{
        height: 500px!important;
    }
</style>