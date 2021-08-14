<template>
    <div class="ui-filter-btn">
        <el-button
            size="small" icon="icon-zhongzhi"
            @click="handleReset">
            重置
        </el-button>
        <el-button
            size="small" type="primary"
            icon="icon-chaxun"
            @click="handleQuery">
            查询
        </el-button>
        <el-button
            v-show="!filterShow && overflow"
            size="small"
            type="text"
            @click="handleClickFilter">
            高级筛选<i class="el-icon-caret-bottom"></i>
        </el-button>
        <el-button
            v-show="filterShow && overflow"
            size="small"
            type="text"
            @click="handleClickFilter">
            基本筛选<i class="el-icon-caret-top"></i>
        </el-button>
    </div>
</template>

<script>
/**
     * @props => resetFn 重置方法
     * @props => queryFn 重置方法
     * @props => params  查询参数
     * @props => refTable  表格实例
     * */
import CONFIG from '@/assets/js/config';
export default {
    name: 'FilterBtn',
    props: {
        resetFn: {
            type: Function,
            default () {
                console.log('not reset function!');
            },
        },
        queryFn: {
            type: Function,
            default () {
                console.log('not query function!');
            },
        },
        params: {
            type: Object,
            default () {
                return {};
            },
        },
        refTable: {
            type: String,
            default () {
                return '';
            },
        },
    },
    data () {
        return {
            filterShow: false,
            overflow: false,
        };
    },
    mounted () {
        this.$nextTick().then(() => {
            this.autoHideEle();
            this.overflow = document.querySelectorAll('.ui-main-module-search > li').length > 10;
        });
    },
    methods: {
        // 高级筛选
        handleClickFilter () {
            if (this.filterShow) {
                this.autoHideEle();
                document.querySelector('body').style.overflow = 'hidden';
            } else {
                this.autoHideEle('show');
            }
            this.filterShow = !this.filterShow;

            const refObj = this.$parent.$parent.$children.find((item) => { return item.$options.name === 'ComTable'; });
            refObj && refObj.handleRefreshHeight && refObj.handleRefreshHeight();

        },

        handleQuery () {
            const obj = {
                [CONFIG.PAGE_PARAMS.PROP.SIZE]: 20,
                ...this.params,
            };
            this.queryFn && this.queryFn(obj);
        },
        handleReset () {
            this.resetFn && this.resetFn();
        },

        autoHideEle (type = 'hide') {
            document.querySelectorAll('.ui-main-module-search > li').forEach((_ele) => {
                if (type === 'show') {
                    _ele.style.display = 'block';
                } else {
                    const top = _ele.getBoundingClientRect().top;
                    // console.log(top);
                    if (top > 155) {
                        _ele.style.display = 'none';
                    }
                }
            });
        },
    },
};
</script>

<style scoped>

</style>
