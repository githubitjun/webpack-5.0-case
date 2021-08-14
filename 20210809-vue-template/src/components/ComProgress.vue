<template>
    <div>
        <div class="progressTop">
            <p>{{label}}</p>
            <p>{{progressNum}}件</p>
        </div>
       <el-progress :percentage="percentage" :color="confColor" :stroke-width="strokeWidth" :show-text="false"></el-progress>
    </div>
</template>

<script>
    export default {
        name: "ComProgress",
        props: {
            label: {
                type: [String, Number],
                default: ''
            },
            total:{//总数
                type: [String, Number],
                default: ''
            },
            progressNum:{//进度数
                type: [String, Number],
                default: ''
            },
            // customColor:{
            //     type: [String, Number],
            //     default: '#409EFF'
            // },
            strokeWidth:{
                type: [String, Number],
                default: 20
            }
        },
        data() {
            return {
                config: {
                    green: ['已播种','已复核'],
                    red: ['未播种','未复核'],
                    blue: ['总件数'],
                },
                color:{
                    green:'#47C932',
                    red:'#FF6666',
                    blue:'#409EFF',
                }
                
            }
        },
        computed: {
            percentage(){//进度百分比
                if((this.progressNum||this.progressNum==0)&&this.total) return (Number(this.progressNum)/Number(this.total))*100
                return 0
            },
            confColor() {//颜色
                for (let [key, value] of Object.entries(this.config)) {
                    if (value.includes(this.label)) {
                        return this.color[key]
                    }
                }
                return '#409EFF'
            }
        }
    }
</script>

<style scoped lang="less">
    .progressTop{
        margin-top: 10px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        line-height: 14px;
    }
</style>