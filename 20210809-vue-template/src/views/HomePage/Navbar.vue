<template>
    <div class="ui-nav-bar">

        <div class="logo-img">
            <img :src="nav_logo_img" alt="" />
        </div>
        <!-- <div class="ui-system-info">
            <span :style="{ marginRight: isCollapse ? '0px' : ''}" @click="isCollapse = !isCollapse">
                <i :class="isCollapse ? 'icon-qiehuan1' : 'icon-qiehuan'"></i>
            </span>
        </div> -->
        <el-menu
            ref="navMenu"
            unique-opened
            :default-active="activeIndex"
            class="ui-menu"
            mode="vertical"
            :collapse="isCollapse"
            @select="handleSelectModule">
            <div v-for="(item, index) in routerList" :key="index">
                <el-submenu v-if="item.children && item.children.length" :index="index + 1 + ''">
                    <template slot="title">
                        <i :class="autoActiveParentNav(index + 1) ? 'active ' + item.icon : 'default ' + item.icon "></i>
                        <span :class="autoActiveParentNav(index + 1) ? 'active' : ''">{{ item.name }}</span>
                    </template>
                    <el-menu-item-group
                        v-for="(itemChild, inx) in item.children"
                        :key="inx">
                        <el-menu-item
                            v-if="itemChild.isHiddenChild || !itemChild.children || !itemChild.children.length"
                            :index="(index + 1) + '-' + (inx + 1)">
                            <span class="menu-item-dot"><i
                                class="normal-dot"
                                :class="autoActiveParentNav((index + 1) + '-' + (inx + 1)) ? 'active-dot' : ''"></i></span>
                            <span :class="autoActiveParentNav((index + 1) + '-' + (inx + 1)) ? 'active ui-twoChild' : 'ui-twoChild'">
                                {{ itemChild.name.includes('-')? itemChild.name.split("-",3)[1]: itemChild.name }}
                            </span>
                        </el-menu-item>
                        <el-submenu
                            v-if="itemChild.children && itemChild.children.length && !itemChild.isHiddenChild"
                            :index="(index + 1) + '-' + (inx + 1)">
                            <template slot="title">
                                <span class="menu-item-dot"><i class="normal-dot" :class="autoActiveParentNav((index + 1) + '-' + (inx + 1)) ? 'active-dot' : ''"></i></span>
                                <span :class="autoActiveParentNav((index + 1) + '-' + (inx + 1)) ? 'active ui-twoChild' : 'ui-twoChild'">
                                    {{ itemChild.name.includes('-')? itemChild.name.split("-",3)[1]: itemChild.name }}</span>
                            </template>
                            <el-menu-item
                                v-for="(itemChildren, i) in itemChild.children"
                                :key="i"
                                :index="(index + 1) + '-' + (inx + 1) + '-' + (i + 1)">
                                <!-- <span class="menu-item-dot"><i class="normal-dot" :class="autoActiveParentNav((index + 1) + '-' + (inx + 1) + '-' + (i + 1)) ? 'active-dot' : ''"></i></span><span :class="autoActiveParentNav((index + 1) + '-' + (inx + 1) + '-' + (i + 1)) ? 'active' : ''"></span> -->
                                <!-- <span class="ui-threeChild">{{ itemChildren.name.includes('-')? itemChildren.name.split("-",3)[1]: itemChildren.name }}</span> -->
                                <span class="ui-threeChild">{{ itemChildren.name }}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item v-else :index="index + 1 + ''">
                    <i :class="autoActiveParentNav(index + 1) ? 'active ' + item.icon : 'default ' + item.icon "></i>
                    <span slot="title">{{ item.name }}</span>
                </el-menu-item>
            </div>
        </el-menu>
    </div>
</template>

<script>
import * as storage from '@/utils/storage';
import {mapActions, mapGetters} from 'vuex';

import routerConfig from '@/router/routerConfig';
import * as service from '@/services';
import CONFIG from '@/assets/js/config';

export default {
    name: 'NavPage',
    data () {
        return {
            nav_logo_img: require('../../assets/image/logo2.png'),
            isCollapse: true,
            activeIndex: '1-1',
            openIndex: '',
            defaultImg: require('../../assets/image/default_pic.png'),
            closeAccountData: {
                operator: '',
                date: '',
            },
        };
    },
    computed: {
        ...mapGetters(['permitPath', 'navIndex', 'loginInfo']),
        routerList () {
            console.log(routerConfig.getRouteConfig);

            return routerConfig.getRouteConfig;
        },
    },
    watch: {
        isCollapse (val) {
            const view = document.querySelector('.ui-content');
            if (val) {
                setTimeout(() => {
                    view.style.paddingLeft = '90px';
                }, 300);
            } else {
                this.$refs.navMenu.updateActiveIndex();
                view.style.paddingLeft = '220px';
            }
        },
        navIndex (val) {
            this.activeIndex = val;
            this.$refs.navMenu.updateActiveIndex();
        },
    },
    created () {
        const _this = this;
        // window.parent.postMessage({
        //     complete: true,
        // }, CONFIG.IN_PRODUCTION_PATH);

        this.activeIndex = this.navIndex;
        // 接收上传的头像
        window.addEventListener('message', function (e) {
            if (e.data.result) {
                _this.loginInfo.head_image_url = e.data.result;
                _this.$store.commit('SAVE_LOGIN_INFO', _this.loginInfo);
            }
        });
    },
    methods: {

        // 菜单选择
        handleSelectModule (inx) {

            this.activeIndex = inx;
            storage.setSessionStorage('navActive', inx);

            const to = routerConfig.navJumpFn(inx);
            this.$router.push(to.path);
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name: to.name,
                index: inx,
            });
            this.$store.commit('SAVE_NAV_INDEX', inx);
        },


        // 激活父级导航
        autoActiveParentNav (inx) {
            return new RegExp(`^${inx}`).exec(this.navIndex);
        },
    },
};
</script>

<style scoped lang="less">

    .logo-img {
        padding: 0 5px;
        margin: 20px 0;
        text-align: center;
    }
    .el-menu > div {
        & > .el-menu-item {
            height: 40px;
            padding-right: 10px !important;
            padding-left: 10px !important;
            font-size: 14px;
            font-weight: bold;
            line-height: 40px;
            color: #a2aab8;
            background: none;
            border-bottom: 1px #283c50 solid;
        }
    }
    .el-menu--collapse .el-menu-item span,
    .el-menu--collapse .el-submenu .el-submenu__title span {
        // display: none;
    }
    .el-menu--collapse .el-submenu {
        /deep/ .el-submenu__title {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 12px;

            // padding: 0 20px !important;
            text-align: center;
            // background-color: rgba(24, 144, 255, 0.4);
            .el-submenu__icon-arrow {
                display: none;
            }
        }
    }
    .ui-nav .el-menu /deep/.el-submenu__title {
        display: flex;
        align-items: center;
    }
    // .el-menu-item.is-active {
    //     color: #fff;
    // }
    // .ui-nav .el-menu .active {
    //     color: #fff;
    // }
    .el-submenu__title span {
        line-height: 1.8;
    }
</style>
