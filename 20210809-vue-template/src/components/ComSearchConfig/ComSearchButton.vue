<style lang="less" scoped>
    .ui-search-config-btn {
        font-family: "Microsoft YaHei","微软雅黑";
        padding: 0;
        line-height: 27px;
        font-size: 12px;
        color: #333;
        padding-right: 18px;
        border-bottom-color: #e6e6e6;
        i {
            margin-right: 3px;
            position: relative;
            top: 1px;
            color: #999;
        }
        &:hover {
            color: #409EFF;
        }
    }
    .ui-container {
        border-top: 1px solid #e6e6e6;
        background: #fafafa;
    }
    .ui-search-container {
        position: fixed;
        top: 30px;
        bottom: 0;
        right: 0;
        background: white;
        width: 333px;
        overflow: auto;
        z-index: 999;
        border-radius: 2px;
        box-shadow: -2px -2px 6px #dbd9d9;
        display: flex;
        flex-direction: column;
    }
    .move-enter-active {
        -webkit-animation: move-in .4s;
    }
    .move-leave-active {
        -webkit-animation: move-out .4s;
    }
    @-webkit-keyframes move-in {
        0% {
            -webkit-transform: translate3d(100%, 0, 0);
        }
        100% {
            -webkit-transform: translate3d(0,0,0);
        }
    }
    @-webkit-keyframes move-out {
        0% {
            -webkit-transform: translate3d(0,0,0);
        }
        100% {
            -webkit-transform: translate3d(100%,0,0);
        }
    }
    .ui-checkbox-container {
        display: flex;
        flex-direction: column;
        flex: auto;
        overflow: auto;
        padding-left: 10px;
         /deep/ .el-checkbox__label {
            padding-left: 6px;
        }
    }
    .el-checkbox-group {
        display: flex;
        flex-direction: column;
        flex: auto;
        &::-webkit-scrollbar{width:0}
        .el-checkbox {
            margin-left: 20px!important;
            .el-checkbox__inner {
                border-radius: 0;
            }
        }
        .el-checkbox+.el-checkbox {
            margin-top:6px;
        }
    }
    .ui-search {
        padding: 12px 12px 10px 10px;
        /deep/ .el-input__inner {
            height: 30px!important;
            line-height: 30px;
        }
        /deep/ .el-input__icon {
            line-height: unset;
        }
    }
    .ui-footer {
        padding: 10px;
        display: flex;
        justify-content: space-evenly;
    }
</style>
<template>
    <div
        v-if="isShowPath"
        v-clickOutside="handleCancel" class="ui-container">
        <el-button
            type="text" class="ui-search-config-btn"
            @click="handleClick">
            <i class="el-icon-search"></i>搜索配置
        </el-button>
        <transition name="move">
            <div v-show="show && searchConfigItems" class="ui-search-container">
                <div class="ui-search">
                    <el-input
                        v-model="queryData.fields"
                        placeholder="请输入搜索条件"
                        suffix-icon="el-icon-search"
                        clearable
                        @input="handleFuzzyQuery()" />
                </div>
                <div v-if="searchCofingOnes[this.$route.path]" class="ui-checkbox-container">
                    <div
                        v-for="(item, index) in handleFuzzyQuery()" :key="index"
                        style="margin: 3px 0; text-align: left;">
                        <el-checkbox
                            v-model="configB[item.key]" :indeterminate="configC[item.key]"
                            @change="(val) => {handleCheckAllChange(val, item, index)}">
                            {{ item.category }}
                        </el-checkbox>

                        <el-checkbox-group
                            v-model="configA[item.key]"
                            @change="handleCheckedChange($event, item, index)">
                            {{ item.category }}
                            <el-checkbox
                                v-for="_item in item.fields" :key="_item.htmlName + index"
                                :label="_item.htmlName">
                                {{ _item.attributeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div
                    v-else class="ui-checkbox-container"
                    style="text-align: left;">
                    <el-checkbox
                        v-for="(item, index) in allData"
                        :key="index"
                        v-model="item['checked']"
                        :label="item.htmlName">
                        {{ item.attributeName }}
                    </el-checkbox>
                </div>
                <div class="ui-footer">
                    <el-button size="small" @click="handleCancel">
                        取 消
                    </el-button>
                    <el-button
                        type="primary" size="small"
                        @click="handleConfirm">
                        确 定
                    </el-button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import Store from '@/store';
import {mapGetters} from 'vuex';
import {chooseConditions} from '../../api/comsearch';
import clickOutside from '@/directive/clickOutside';
import {searchCofingOnes, searchCofingPage} from './dataConfig';

export default {
    name: 'ComSearchButton',
    directives: {
        clickOutside,
    },
    props: {},
    data () {
        return {
            show: false,
            queryData: {fields: ''},

            cities: [1, 2, 3, 4],
            checkedData: [],
            // 绑定值
            configA: {
                listing: [], // listing维度
                sku: [], // sku维度
                range: [], // 区间筛选
                users: [], // 权限筛选
            },
            // 是否全选checkbox
            configB: {
                listing: false, // listing维度
                sku: false, // sku维度
                range: false, // 区间筛选
                users: false, // 权限筛选
            },
            // 全选 checkbox的不确定状态
            configC: {
                listing: false, // listing维度
                sku: false, // sku维度
                range: false, // 区间筛选
                users: false, // 权限筛选
            },

        };
    },
    computed: {
        ...mapGetters(['searchConfig', 'searchConfigItems']),

        isShowPath: function () {
            // 需在 dataConfig文件配置页面 搜索配置
            const isTrue = searchCofingPage.some((item) => {
                return item == this.$route.path;
            });
            return isTrue;
        },
        allData: {
            get () {
                return this.handleFuzzyQuery();
            },
        },
        searchCofingOnes: {
            get () {
                return searchCofingOnes;
            },
        },
    },
    watch: {
        $route (nv) {
            if (nv) {
                this.show = false;
            }
        },
    },
    methods: {
        handleClick () {
            this.show = !this.show;
            if (this.searchCofingOnes[this.$route.path]) {
                for (const k in this.configA) {
                    this.allData.forEach((item) => {
                        if (k == item.key) {
                            this.configA[item.key] = item.checkedItemsData;
                            const checkedCount = this.configA[item.key].length;
                            this.configC[item.key] = checkedCount > 0 && checkedCount < item.fields.length;
                            this.configB[item.key] = this.configA[item.key].length === item.fields.length;
                        }
                    });
                }
            }
        },
        handleCancel () {
            this.show = false;
        },
        handleConfirm () {
            this.show = false;

            if (this.searchCofingOnes[this.$route.path]) {
                this.searchConfig[this.$route.path].all_data.forEach((item) => {
                    item.checked = false;
                    this.allData.map((allItem) => {
                        allItem.checkedItemsData.forEach((checkItem) => {
                            if (checkItem == item.htmlName) {
                                item.checked = true;
                            }
                        });
                    });
                });
                const vaildData = this.searchConfig[this.$route.path].all_data.filter((item) => {
                    return item.checked == 1;
                });
                Store.commit('SAVE_CHECK_MAINDATA', vaildData);
                this.searchConfig[this.$route.path].original_data = this.allData;
                Store.commit('SAVE_COMMON_SEARCH_CONFIG', this.searchConfig);

            } else {
                const vaildData = this.searchConfig[this.$route.path].all_data.filter((item) => { return item.checked == 1; });
                Store.commit('SAVE_CHECK_MAINDATA', vaildData);
                const searchConfig = this.searchConfig[this.$route.path].all_data;
                Store.commit('SAVE_COMMON_SEARCH_CONFIG', searchConfig);
            }

        },
        handelSubmitData (newData) {
            // const pid = '';
            // // Object.keys(afterMoudleConfig).forEach((i) => { if (afterMoudleConfig[i] === this.$route.path) { pid = i; } });
            // const params = {conditions: newData.map((item) => { return item.htmlName; }), pid};
            // chooseConditions(params).then((data) => {
            //     if (data.status !== 1) {
            //         this.$message.error(data.errorMess);
            //         return;
            //     } else {
            //         this.$message.success('操作成功');
            //     }

            // }).catch((error) => { this.$message.error(error); });
        },
        // 模糊查询
        handleFuzzyQuery () {
            let newArr = this.searchConfigItems;
            if (this.searchCofingOnes[this.$route.path]) {
                if (this.searchConfig && this.searchConfig[this.$route.path]) {
                    newArr = this.searchConfig[this.$route.path].original_data.filter((item) => {
                        return item.fields.filter((_item) => {
                            return _item.attributeName.indexOf(this.queryData.fields) >= 0;
                        }).length;
                    });
                    for (const k in this.configA) {
                        newArr.forEach((item) => {
                            if (k == item.key) {
                                item.checkedAll = item.fields.map((v) => { return v.htmlName; });
                            }
                        });
                    }
                    newArr = newArr.map((item) => {
                        return {
                            category: item.category,
                            fields: item.fields,
                            checkedItemsData: item.checkedItemsData ? item.checkedItemsData : item.checkedAll, // 如果没有保存过搜索配置，则全部选上
                            key: item.key,
                        };
                    });
                    // console.log(newArr);
                }
            } else {
                if (this.searchConfig && this.searchConfig[this.$route.path]) {
                    newArr = this.searchConfig[this.$route.path].all_data.filter((item) => {
                        return item.attributeName.indexOf(this.queryData.fields) >= 0;
                    });
                }
            }
            return newArr;
        },
        // 某个父级（全选）
        handleCheckAllChange (value, item, index) {
            this.configA[item.key] = value ? item.fields.map((item) => {
                return item.htmlName;
            }) : [];
            this.configC[item.key] = false;
            this.configB[item.key] = this.configA[item.key].length === item.fields.length;
            this.allData[index].checkedItemsData = JSON.parse(JSON.stringify(this.configA[item.key]));
        },
        // 勾选某个
        handleCheckedChange (value, item, index) {
            const checkedCount = this.configA[item.key].length;
            this.configB[item.key] = checkedCount === item.fields.length;
            this.configC[item.key] = checkedCount > 0 && checkedCount < item.fields.length;
            this.allData[index].checkedItemsData = this.configA[item.key];
        },
    },
};
</script>

