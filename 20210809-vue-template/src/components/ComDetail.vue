<template>
    <com-dialog :title="title" :visible.sync="show" :width="width">
        <div class="ui-detail">
            <div class="ui-detail__item" v-for="(detail) in detailData">
                <div class="ui-detail__title" v-if="detail.title">
                    <span>{{detail.title}}</span>
                </div>
                <div class="ui-detail__base">
                    <table v-if="!detail.slot">
                        <tr v-for="(row, index) in Math.ceil(detail.item.length / rowLength)">
                            <template v-for="(col, __inx) in rowLength">
                                <td class="ui-title" v-if="detail.item[(index * rowLength) + __inx] && detail.item[(index * rowLength) + __inx].span">
                                    <span>{{detail.item[(index * rowLength) + __inx].label}}</span></td>
                                <td class="ui-info" v-if="detail.item[(index * rowLength) + __inx] && detail.item[(index * rowLength) + __inx].span"
                                    :colspan="detail.item[(index * rowLength) + __inx].span * 2 - 1">
                                    <span>{{detail.item[(index * rowLength) + __inx].value}}</span>
                                </td>
                            </template>
                        </tr>
                    </table>
                    <slot v-else :name="detail.slot" :item="detail.item"></slot>
                </div>
            </div>
        </div>
        <div slot="footer">
            <slot></slot>
        </div>
    </com-dialog>
</template>

<script>
    export default {
        name: "ComDetail",
        props: {
            title: {
                type: String,
                default: ''
            },
            showData: {
                type: Array,
                default() {
                    return []
                }
            },
            rowLength: {
                type: Number,
                default: 3
            },
            width: {
                type: String,
                default: '1000px'
            }
        },
        data() {
            return {
                show: false
            }
        },
        computed: {
            detailData() {
                return this.showData.map(detail => {
                    if (detail.slot) return detail;
                    else return {
                        ...detail,
                        item: detail.item.reduce((temp, item) => {
                            if (!item.span) {
                                return [...temp, { ...item, span: 1 }];
                            } else {
                                let change = [];
                                for (let i = 0; i < item.span; i++) {
                                    change.push(!i ? item : { ...item, span: 0 });
                                }
                                return [...temp, ...change];
                            }
                        }, [])
                    }
                })
            }
        },
        methods: {
            // 显示
            handleShow(data) {
                this.show = true;
            },

            // 关闭
            handleClose() {
                this.show = false;
                this.$emit('update:showData', [])
            }
        }
    }
</script>

<style scoped lang="less">

    .ui-detail__item {
        margin-bottom: 15px;
    }

    .ui-detail__title {
        height: 28px;
        line-height: 28px;

        span {
            color: #333;
            font-size: 14px;
            border-left: 2px solid #666;
            padding-left: 5px;
        }
    }
</style>