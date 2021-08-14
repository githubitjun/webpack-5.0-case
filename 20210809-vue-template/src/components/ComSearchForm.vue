<template>
    <transition name="slide-fade">
        <div class="ui-search-form">
            <div
                ref="searchEle" class="ui-search-area"
                :style="searchStyle[showSearch ? 'up' : 'down']">
                <ul class="ui-main-module-search clearFix">
                    <slot></slot>
                </ul>
                <FilterBtn
                    refTable="myTable"
                    :params="params"
                    :resetFn="resetFn"
                    :queryFn="queryFn" />
            </div>
            <span class="ui-top_i" @click="handleSearchChange"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'" /></span>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'ComSearchItem',
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
    },
    data () {
        return {
            showSearch: false,
            searchHeight: 0,
        };
    },
    computed: {
        searchStyle () {
            return {
                up: {
                    height: '',
                },
                down: {
                    height: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    border: '0 none',
                },
            };
        },
    },
    mounted () {
        this.handleSearchChange();
    },
    methods: {
        handleSearchChange () {
            this.showSearch = !this.showSearch;
            const pageTable = this.$parent.$children.find((item) => { return item.$options.name === 'ComTable'; });
            pageTable && pageTable.handleSearchChange();
        },
    },
};
</script>

<style scoped lang="less">
    .ui-search-area {
        box-sizing: border-box;
        transition: padding .3s;
    }
    .ui-search-form {
        position: relative;
    }
    .ui-top_i {
        position: absolute;
        bottom: -10px;
        z-index: 1;
        height: 10px;
        cursor: pointer;
        & > i {
          vertical-align: top;
        }
    }
</style>
