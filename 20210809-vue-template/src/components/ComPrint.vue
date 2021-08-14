<template>
    <div class="ui-qrcode_print">
        <!--<iframe name="myIframe" ref="myIframe" :src="`/home/qrCodeIndex?sku_list=${data}`" frameborder="0"></iframe>-->
    </div>
</template>

<script>
    import {
        printCodeHtml
    } from '@/api/common'

    export default {
        name:'ComPrint',
        props: ['data'],
        data() {
            return {
                url: ''
            }
        },
        methods: {
            handlePrint(data) {

                // 新版本打印
                // window.open(`/home/qrCodeIndex?sku_list=${this.data}`, '_blank');
                // return;

                // 老版本打印 0--
                const printArea = document.querySelector('.ui-qrcode_print');
                const iframe = document.createElement("iframe");
                iframe.name = 'myIframe';
                iframe.src = `${CONFIG.ROOT_URL}/print/QRCode.php?data=${data}`;
                if (iframe.attachEvent){
                    iframe.onload = function(){
                        console.log('printOk')
                        // window.frames['myIframe'].open(iframe.src, 'newwindow', 'height=100, width=100')
                    };
                } else {
                    iframe.onload = function(){
                        console.log('printOk')
                        // window.frames['myIframe'].open(iframe.src, '_blank', 'height=0, width=0')
                    };
                }
                printArea.appendChild(iframe);
            }
        },
        watch: {
            data(val) {

            }
        }
    }
</script>

<style scoped lang>
    .ui-qrcode_print {
        position: absolute;
        z-index: -999;
        top: 0;
        left: 0;
        width: 66mm;
        height: 32mm;
    }
</style>