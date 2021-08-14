<template>
    <div class="ui-data-card">
        <ul>
            <li>
                <el-card class="box-card">
                    <div class="ui-card-top">
                        <div class="ui-card-top-left">
                            <span>昨日数据</span>
                            <el-tooltip
                                class="item" effect="dark"
                                content="昨天00:00:00-23:59:59，支付完成的订单和销售额数据" placement="top">
                                <i class="icon-tishi"></i>
                            </el-tooltip>
                        </div>
                        <div class="ui-card-top-right">
                            <span>查看订单</span>
                            <i class="el-icon-d-arrow-right"></i>
                        </div>
                    </div>
                    <div class="ui-card-content">
                        <div class="ui-content-item">
                            <p>订单量</p>
                            <span>2000000单</span>
                        </div>
                        <div class="ui-content-item">
                            <p>销售额</p>
                            <span>￥12000000</span>
                        </div>
                    </div>
                </el-card>
            </li>
            <li>
                <el-card class="box-card">
                    <div class="ui-card-top">
                        <div class="ui-card-top-left">
                            <span>近7天数据</span>
                            <el-tooltip
                                class="item" effect="dark"
                                content="近7天，支付完成的订单和销售额数据" placement="top">
                                <i class="icon-tishi"></i>
                            </el-tooltip>
                        </div>
                        <div class="ui-card-top-right">
                            <span>查看订单</span>
                            <i class="el-icon-d-arrow-right"></i>
                        </div>
                    </div>
                    <div class="ui-card-content">
                        <div class="ui-content-item">
                            <p>订单量</p>
                            <span>2000000单</span>
                        </div>
                        <div class="ui-content-item">
                            <p>销售额</p>
                            <span>￥12000000</span>
                        </div>
                    </div>
                </el-card>
            </li>
            <li>
                <el-card class="box-card">
                    <div class="ui-card-top">
                        <div class="ui-card-top-left">
                            <span>近7天数据</span>
                        </div>
                        <div class="ui-card-top-right">
                            <span>查看订单</span>
                            <i class="el-icon-d-arrow-right"></i>
                        </div>
                    </div>
                    <div class="ui-card-content">
                        <div class="ui-content-item">
                            <p>昨日结算单量</p>
                            <span>2000000单</span>
                        </div>
                        <div class="ui-content-item">
                            <p>截止今日0时未结算单量</p>
                            <span>￥12000000</span>
                        </div>
                    </div>
                </el-card>
            </li>
        </ul>

    </div>
</template>

<script>
export default {
    name: 'home_page',
};
</script>

<style scoped lang="less">
.ui-data-card {
    padding: 20px;
    background: #fff;
    ul {
        display: flex;
        li {
            margin-right: 20px;
        }
    }
    .box-card {
        width: 320px;
        height: 150px;
        border-radius: 8px;
        /deep/.el-card__body {
            padding: 0;
        }
        .ui-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px;
            border-bottom: 1px solid #dcdfe6;
            .ui-card-top-left {
                font-size: 16px;
                color: #333;
            }
            .ui-card-top-right {
                font-size: 12px;
                color: #38f;
                cursor: pointer;
            }
        }
        .ui-card-content {
            padding-top: 10px;
            .ui-content-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 15px;
                p {
                    font-size: 12px;
                    color: #666;
                }
                span {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                }
            }
        }
    }
    .icon-tishi {
        width: 25px;
        color: #fd996b;
    }
}
</style>
