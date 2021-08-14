<template>
    <div class="ui-multiple_tab">
        <ul class="clearFix">
            <li
                v-for="(item,i) in tabLabel" :key="i"
                class="ui-multiple_tab-item">
                <span :class="item.index === navIndex && 'ui-link'" @click="handleToggleRouter(item)">{{ item.name }}</span>
                <i class="el-icon-close" @click="handleRemoveLabel(item.path)"></i>
            </li>
        </ul>
        <div class="ui-close_other">
            <span class="ui-line"></span><span @click="handleCloseOtherLabel">关闭其他页</span>
        </div>
    </div>
</template>

<script>
import {
    mapGetters,
} from 'vuex';
import routerConfig from '@/router/routerConfig';

export default {
    name: 'MultipleTab',
    computed: {
        ...mapGetters(['tabLabel', 'navIndex', 'loginInfo', 'permitPath']),
        activeRouter () {
            return routerConfig.navJumpFn(this.navIndex);
        },
    },
    methods: {
        // 切换路由
        handleToggleRouter (route) {
            this.$store.commit('SAVE_NAV_INDEX', route.index);
            this.$router.push(route.path);
        },

        // 移除页签
        handleRemoveLabel (path) {
            if (this.tabLabel.length === 1) { return; }
            for (let i = 0; i < this.tabLabel.length; i++) {
                if (this.tabLabel[i].path === path) {
                    if (this.tabLabel[i].index === this.navIndex) {
                        if (i > 0) {
                            this.$router.push(this.tabLabel[i - 1].path);
                            this.$store.commit('SAVE_NAV_INDEX', this.tabLabel[i - 1].index);
                        } else {
                            this.$router.push(this.tabLabel[i + 1].path);
                            this.$store.commit('SAVE_NAV_INDEX', this.tabLabel[i + 1].index);
                        }
                    }
                    this.$store.commit('SAVE_TAB_LABELS', {
                        path: path,
                        isRemove: 1,
                        isRemoveInx: i,
                    });
                    // real 项目和 Allegro 项目的关闭不移除缓存, 其他的移除缓存
                    // 判断 path 是不是以指定字符结尾来判断是否是 real 和 Allegro 项目的页面
                    if (!path.endsWith('Actual') && !path.endsWith('Fast')) {
                        this.$store.commit('SAVE_KEEP_ALIVE_LABEL', {
                            type: 'del',
                            path: path,
                        });
                    }

                    break;
                }
            }
        },

        // 移除其他标签
        handleCloseOtherLabel () {
            this.$store.commit('SAVE_TAB_LABELS', {
                path: routerConfig.navJumpFn(this.navIndex).path,
                name: routerConfig.navJumpFn(this.navIndex).name,
                isRemove: 2,
            });
        },
    },
};
</script>

<style scoped lang="less">

    @import (reference) '../../../assets/less/index';
    @module-bdr_color: #e6e6e6;
    .ui-multiple_tab {
        position: relative;
        box-sizing: border-box;
        height: 30px;
        overflow: hidden;
        background: #fff;
        border: 1px solid @base-bdr-color;
        border-bottom: 0 none;
        ul {
            height: 28px;
            // background: #f9f9f9;
            background: #f2f2f2;
            border-bottom: 1px solid @module-bdr_color;
        }
        .ui-multiple_tab-item {
            position: relative;
            box-sizing: border-box;
            float: left;
            height: 30px;
            margin-left: 10px;
            span {
                display: inline-block;
                padding: 0 10px;
                font-size: 12px;
                line-height: 28px;
                color: #656565;
                cursor: pointer;
                border: 1px solid transparent;
                border-bottom-color: @module-bdr_color;
                border-radius: 4px 4px 0 0;
                transition: all 0.2s linear;
            }
            i {
                position: absolute;
                top: 9px;
                right: -3px;
                display: none;
                margin-right: 0;
                margin-left: 10px;
                font-size: 10px;
                cursor: pointer;
                transition: all 0.2s linear;
            }
            &:hover i {
                display: block;
            }
            span.ui-link {
                padding-right: 28px;
                background: #fff;
                border: 1px solid @module-bdr_color;
                border-bottom: 1px solid #fff;
            }
            span.ui-link + i {
                top: 8px;
                right: 10px;
                display: block !important;
                width: 13px;
                height: 13px;
                line-height: 13px;
                color: #fff;
                border-radius: 50%;
            }
        }
        .ui-close_other {
            position: absolute;
            top: 6px;
            right: 16px;
            font-size: 10px;
            color: #9a9a9a;
            cursor: pointer;
            .ui-line {
                position: relative;
                top: 2px;
                right: 5px;
                display: inline-block;
                width: 1px;
                height: 12px;
                background: #9a9a9a;
            }
        }
    }
</style>
