<template>
    <div class="ui-state_txt" v-if="state">
        <i class="ui-state_txt--flag" :class="`state_${state}`"></i>
        <span>{{label}}</span>
    </div>
    <span v-else>{{label}}</span>
</template>

<script>
    export default {
        name: "ComState",
        props: {
            label: {
                type: [String, Number,Object],
                default: ''
            }
        },
        data() {
            return {
                config: {
                    green: ['已QC', '完全贴标', '完全到货', 'QC完成', '合格', '已完成', '启用','是','已入库','已审核','已交运'],
                    orange: ['部分上架', '匹配中', '待全检', '部分贴标', '贴标超出', '上架超出', '待确认', '待IQC处理','待采购处理','待质控处理','等待处理','待审核','待采购下单','待入库','待打包'],
                    blue: ['创建'],
                    red: ['不合格', '停用','禁用','来货争议','冻结','有'],
                    gray: ['未签收', '未QC', '取消','否','已取消']
                }
            }
        },
        computed: {
            state() {
                for (let [key, value] of Object.entries(this.config)) {
                    if (value.includes(this.label)) {
                        return key
                    }
                }
                return false;
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-state_txt {
        vertical-align: middle;
        &--flag {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
        }

        span {
            vertical-align: middle;
        }
    }
</style>