<!--  -->
<template>
    <div class="ui-com-search-topbnt">
        <!-- 销量筛选 -->
        <el-popover
            v-if="tex && regionBntData['sales']"
            v-model="visibleSales"
            placement="bottom-start"
            width="400"
            trigger="click">
            <div>
                <div class="ui-checkbox-title">
                    提示：先勾选选择时间，再填写数量(只查询勾选的条件)
                </div>
                <div class="ui-checkbox-box">
                    <el-checkbox-group v-model="checkSalesList ">
                        <div
                            v-for="(value, key) in regionBntData['sales'].selectData" :key="key"
                            class="ui-check-item">
                            <el-checkbox :label="key">
                                {{ value }}
                            </el-checkbox>
                            <div>
                                <el-input
                                    v-model="sales[key]" style="width: 100px;"
                                    size="small" placeholder="请输入数字" />
                                <span>至</span>
                                <el-input
                                    v-model="sales[key + '_level']" style="width: 100px"
                                    size="small" placeholder="请输入数字" />
                            </div>
                        </div>
                    </el-checkbox-group>

                    <div class="ui-footer">
                        <el-button size="small" @click="visibleSales = false">
                            取 消
                        </el-button>
                        <el-button
                            type="primary" size="small"
                            @click="handelSalesParams">
                            保 存
                        </el-button>
                    </div>
                </div>
            </div>
            <el-badge
                slot="reference" :value="'+'+chenckSalesSum"
                class="item-badge">
                <el-button
                    size="small">
                    <i class="el-icon-set-up"></i>销量筛选
                </el-button>
            </el-badge>
        </el-popover>

        <!-- 趋势筛选 -->
        <el-popover
            v-if="tex && regionBntData['trend']"
            v-model="visibletTrend"
            placement="bottom-start"
            width="400"
            trigger="click">
            <div>
                <div class="ui-checkbox-title">
                    提示：先勾选数值、百分比，再填写(只查询勾选的条件)
                </div>
                <div class="ui-checkbox-box">
                    <el-checkbox-group v-model="checkTrendList">
                        <div class="ui-check-item">
                            <span class="check-title-span">日趋势</span>
                            <div>
                                <div class="numerical-box">
                                    <el-checkbox label="day_trend">
                                        数值
                                    </el-checkbox>
                                    <el-input
                                        v-model="trend.day_trend[0]" style="width: 100px;"
                                        size="small" placeholder="请输入数字" />
                                    <span>至</span>
                                    <el-input
                                        v-model="trend.day_trend[1]" style="width: 100px"
                                        size="small" placeholder="请输入数字" />
                                </div>
                                <div>
                                    <el-checkbox label="day_trend_rate">
                                        百分比
                                    </el-checkbox>
                                    <el-input
                                        v-model="trend.day_trend_rate[0]" style="width: 100px;"
                                        size="small">
                                        <template slot="append">
                                            %
                                        </template>
                                    </el-input>
                                    <span>至</span>
                                    <el-input
                                        v-model="trend.day_trend_rate[1]" style="width: 100px"
                                        size="small">
                                        <template slot="append">
                                            %
                                        </template>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <div class="ui-check-item">
                            <span class="check-title-span">周趋势</span>
                            <div>
                                <div class="numerical-box">
                                    <el-checkbox label="week_trend">
                                        数值
                                    </el-checkbox>
                                    <el-input
                                        v-model="trend.week_trend[0]" style="width: 100px;"
                                        size="small" placeholder="请输入数字" />
                                    <span>至</span>
                                    <el-input
                                        v-model="trend.week_trend[1]" style="width: 100px"
                                        size="small" placeholder="请输入数字" />
                                </div>
                                <div>
                                    <el-checkbox label="week_trend_rate">
                                        百分比
                                    </el-checkbox>
                                    <el-input
                                        v-model="trend.week_trend_rate[0]" style="width: 100px;"
                                        size="small">
                                        <template slot="append">
                                            %
                                        </template>
                                    </el-input>
                                    <span>至</span>
                                    <el-input
                                        v-model="trend.week_trend_rate[1]" style="width: 100px"
                                        size="small">
                                        <template slot="append">
                                            %
                                        </template>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <div class="ui-check-item">
                            <span class="check-title-span">月趋势</span>
                            <div>
                                <div class="numerical-box">
                                    <el-checkbox label="month_trend">
                                        数值
                                    </el-checkbox>
                                    <el-input
                                        v-model="trend.month_trend[0]" style="width: 100px;"
                                        size="small" placeholder="请输入数字" />
                                    <span>至</span>
                                    <el-input
                                        v-model="trend.month_trend[1]" style="width: 100px"
                                        size="small" placeholder="请输入数字" />
                                </div>
                                <div>
                                    <el-checkbox label="month_trend_rate">
                                        百分比
                                    </el-checkbox>
                                    <el-input
                                        v-model="trend.month_trend_rate[0]" style="width: 100px;"
                                        size="small">
                                        <template slot="append">
                                            %
                                        </template>
                                    </el-input>
                                    <span>至</span>
                                    <el-input
                                        v-model="trend.month_trend_rate[1]" style="width: 100px"
                                        size="small">
                                        <template slot="append">
                                            %
                                        </template>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                    </el-checkbox-group>
                </div>
                <div class="ui-footer">
                    <el-button size="small" @click="visibletTrend = false">
                        取 消
                    </el-button>
                    <el-button
                        type="primary" size="small"
                        @click="handelTrendParams">
                        保 存
                    </el-button>
                </div>
            </div>
            <el-badge
                slot="reference" :value="'+' + chenckTrendSum"
                class="item-badge">
                <el-button
                    size="small">
                    <i class="el-icon-set-up"></i>趋势筛选
                </el-button>
            </el-badge>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: '',
    data () {
        return {
            // 销量
            checkSalesList: [],
            sales: {},
            salesQuery: {},
            chenckSalesSum: 0,

            // 趋势筛选
            checkTrendList: [],
            trend: {
                // 日
                day_trend: [],
                day_trend_rate: [],

                // 周
                week_trend: [],
                week_trend_rate: [],

                // 月
                month_trend: [],
                month_trend_rate: [],
            },
            trendQuery: {},
            chenckTrendSum: 0,

            visibleSales: false,
            visibletTrend: false,

            regionBntData: this.$parent.regionBntData || {},
            tex: false, // 判断后端数据完成后加载页面DOM
        };
    },
    computed: {
        // 判断父组件数据是否完毕
        parentIsitOver () {
            return this.$parent.regionBntShow;
        },
    },
    watch: {
        async parentIsitOver (n) {
            if (n === false) {
                return;
            }
            if (Object.keys(this.$parent.regionBntData).length > 0) {
                this.regionBntData = this.$parent.regionBntData;
                this.initSalesKey(this.regionBntData);
                this.tex = true;
            }
        },
    },
    async mounted () {
        this.regionBntData = this.$parent.regionBntData;
    },
    methods: {
        // 设置公共查询组件 查询区域参数
        setQueryParms () {
            this.$parent.regionQueryData = {
                ...this.trendQuery,
                ...this.salesQuery,
            };
        },

        // 重置条件
        handleResetQueryParms () {
            this.checkTrendList = [];
            this.chenckSalesSum = 0;

            this.checkSalesList = [];
            this.chenckTrendSum = 0;

            this.trend = {
                day_trend: [],
                day_trend_rate: [],
                week_trend: [],
                week_trend_rate: [],
                month_trend: [],
                month_trend_rate: [],
            };
            this.initSalesKey(this.$parent.regionBntData);
        },

        // 初始化销量配置key
        initSalesKey (Obj) {
            this.sales = {};
            // 判断配置项是否有 【销量配置】
            if (!Obj.sales) {
                return;
            }
            for (const [key, value] of Object.entries(Obj.sales)) {
                this.sales[key] = '';
                this.sales[key + '_level'] = '';
            }
        },

        // 【销量条件筛选】 设置到查询组件里
        handelSalesParams () {
            const params = {};
            this.chenckSalesSum = this.checkSalesList.length;
            this.checkSalesList.forEach((key) => {
                console.log(key, ':', this.sales[key]);
                params[key] = [this.sales[key] || '0', this.sales[key + '_level'] || '0'];
            });
            this.salesQuery = params;
            this.setQueryParms();
            this.visibleSales = false;
        },

        // 【趋势条件筛选】 设置到查询组件里
        handelTrendParams () {
            const params = {};
            this.chenckTrendSum = this.checkTrendList.length;
            this.checkTrendList.forEach((key) => {
                params[key] = [this.trend[key][0] || '0', this.trend[key][1] || '0'];

                if (key.includes('_rate')) {
                    const pFloat0 = parseFloat(this.trend[key][0] || '0');
                    const pFloat1 = parseFloat(this.trend[key][1] || '0');
                    params[key] = [
                        (pFloat0 === 'NaN' ? 0 : (pFloat0 / 100).toFixed(2)),
                        (pFloat1 === 'NaN' ? 0 : (pFloat1 / 100).toFixed(2)),
                    ];
                }
            });
            this.trendQuery = params;
            this.setQueryParms();
            this.visibletTrend = false;
        },
    },
};
</script>
<style scoped lang='less'>
.ui-com-search-topbnt {
    // text-align: start;
    // margin-left: 100px;
    /deep/.el-checkbox-group {
        div {
            display: inline-block;
        }
    }
}

.ui-footer {
    text-align: end;
}
.el-icon-set-up {
    font-size: 14px;
    padding-right: 5px;
}

.el-checkbox-group {
    font-size: 15px;
}
.ui-checkbox-title {
    border-bottom: 1px #ccc solid;
    color: #FF0052;
}
.ui-check-item {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    .el-checkbox {
        padding-top: 10px;
    }
    .check-title-span {
        padding: 10px;
    }
    .numerical-box {
        /deep/.el-input:nth-child(2) {
            margin-left: 11px;
        }
    }
    /deep/.el-input-group__append {
        padding: 0 5px;
    }
}

.item-badge {
    margin-top: 10px;
    margin-right: 20px;
}
</style>
