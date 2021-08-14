<template>
    <div class="editor-wrapper">
        <slot></slot>
        <div :id="editorId"></div>
    </div>
</template>

<script>
import Editor from 'wangeditor';
import 'wangeditor/release/wangEditor.min.css';
import {oneOf} from '@/services';
// import {
//   UploadFile
// } from '@/api/module/kupang_platform/kupang_publish_list'
export default {
    name: 'Editor',
    props: {
        value: {
            type: String,
            default: '',
        },
        /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
        valueType: {
            type: String,
            default: 'html',
            validator: (val) => {
                return oneOf(val, ['html', 'text']);
            },
        },
        /**
     * @description 设置change事件触发时间间隔
     */
        changeInterval: {
            type: Number,
            default: 200,
        },
        /**
     * @description 是否开启本地存储
     */
        cache: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        editorId () {
            return `editor${this._uid}`;
        },
    },
    watch: {
        value () {
            const html = this.value;
            if (html) { this.editor.txt.html(html); }
        },
    },
    mounted () {
        this.editor = new Editor(`#${this.editorId}`);
        this.editor.customConfig.onchange = (html) => {
            const text = this.editor.txt.text();
            if (this.cache) { localStorage.editorCache = html; }
            this.$emit('input', this.valueType === 'html' ? html : text);
            this.$emit('on-change', html, text);
        };
        this.editor.customConfig.onchangeTimeout = this.changeInterval;
        // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
        // this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        // this.editor.customConfig.uploadImgServer = 'http://192.168.0.99:7001/system/information'  // 上传图片到服务器
        this.editor.customConfig.customUploadImg = (files, insert) => {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
            const file = files[0];
            // 看支持不支持FileReader
            if (!file || !window.FileReader) { return; }
            if (/^image/.test(file.type)) {
                // // 创建一个reader
                // let reader = new FileReader();
                // // 将图片2将转成 base64 格式
                // reader.readAsDataURL(file);
                // // 读取成功后的回调
                // reader.onloadstart = function() {

                // };
                // var self=this
                // reader.onloadend = async function() {
                //   let result = this.result.split(',');
                //   console.log(result)

                // };
                console.log(file);
                const formData = new FormData();
                formData.append('file', file);
                UploadFile(formData).then(({data}) => {
                    if (data.code == 1000) {
                        insert(data.data[0].fullUrl);
                    } else {
                        this.$message.error(data.errorMess || '请求失败');
                    }
                });
            }

            // 上传代码返回结果之后，将图片插入到编辑器中

        };
        // create这个方法一定要在所有配置项之后调用
        this.editor.create();
        // 如果本地有存储加载本地存储内容
        // let html = this.value || localStorage.editorCache
        const html = this.value;
        if (html) { this.editor.txt.html(html); }

        document.getElementsByClassName('w-e-text-container')[0].style.zIndex = 0;
        for (let index = 0; index < document.getElementsByClassName('w-e-menu').length; index++) {
            if (index > 10) {
                document.getElementsByClassName('w-e-menu')[index].style.zIndex = 10;
            }

        }
    },
    methods: {
        setHtml (val) {
            this.editor.txt.html(val);
        },
    },
};
</script>

<style lang="less">
.editor-wrapper * {
    // z-index: 100 !important;
}
.w-e-toolbar {
    flex-wrap: wrap;
}
// .editor-wrapper{
//   width: 375px;
// }
.w-e-text-container {
    height: 250px !important;
}
</style>
<style>

</style>
