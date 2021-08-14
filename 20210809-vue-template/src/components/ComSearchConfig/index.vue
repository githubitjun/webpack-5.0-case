<!-- 搜索配置 -->
<template>
    <div>
        <ul class="ui-main-module-search clearFix">
            <transition
                v-for="(item, index) in mainData" :key="item.htmlName"
                name="el-fade-in-linear">
                <li :class="item.cssType === 'textarea'?'common-search-Box':''">
                    <SearchRequirement :label="(item.cssType !== 'input' && item.cssType !== 'select') ? item.attributeName:''">
                        <el-input
                            v-if="item.cssType === 'input'" v-model="queryData[attributeName[index]]"
                            size="small" clearable
                            :placeholder="item.attributeName || '请输入'"
                            @keyup.enter.native="handleQuery(false)" />
                        <el-input
                            v-if="item.cssType === 'textarea'"
                            v-model="queryData[attributeName[index]]"
                            class="common-search-textarea"
                            size="small"
                            type="textarea"
                            clearable
                            :placeholder="`多个${item.attributeName}用英文逗号隔开`" @input="textareaInput($event, attributeName[index])" />
                        <el-select
                            v-if='item.cssType ==="select"' v-model="queryData[attributeName[index]]"
                            v-filter filterable
                            size="small" clearable
                            :remote="isRemote(item)"
                            :remote-method='(query)=> { item["urlAddress"] && item["isUrl"]=="0" ? handleGetOption(item, query) : "" }'
                            :placeholder='item["urlAddress"] && item["isUrl"]=="0" ? "关键词搜索": item.attributeName'
                            :multiple='item["select"] == "2"'
                            collapse-tags
                            @clear="handleClear"
                            @change='(val)=> {
                                item["select"] === "2" ? handleSelectChange(item, val) :
                                handleChange(item, val)}'
                            @focus="()=> {handleSelectFocus(item)}">
                            <el-option
                                v-for="(_item, _index) in item.optionValue" :key="_index"
                                :value='_item["id"]'
                                :label="_item['value']? _item['value']: ''" />
                        </el-select>
                        <!-- :remote-method='(query)=> { item["urlAddress"] !="" &&item["isUrl"]!="0" ? "" : handleGetOption(item, query) }'
                            :placeholder='item["urlAddress"] !="" &&item["isUrl"]!="0" ? "请选择" : "关键词搜索"' -->
                        <!-- :remote='!!item["urlAddress"]' -->
                        <!-- @change='(val)=> {
                                item["select"] === "2" ? handleSelectChange(item, val) :
                                item["caderserString"] ? handleCascaderSelectChange(item, val): handleChange(item, val)}' -->
                        <el-date-picker
                            v-if="item.cssType === 'inputDate' && item.isMonth == 2" v-model="queryData[attributeName[index]]"
                            type="month"
                            value-format="yyyyMM"
                            placeholder="选择月份"
                            size="small"
                            :clearable="!item.isRequire" />
                        <el-date-picker
                            v-else-if="item.cssType === 'inputDate'" v-model="queryData[attributeName[index]]"
                            size="small"
                            :type="item.isMonth == 1 ? 'monthrange' : 'datetimerange'"
                            :start-placeholder="item.isMonth == 1 ? '开始月份' : '开始日期时间'"
                            :end-placeholder="item.isMonth == 1 ? '结束月份' : '结束日期时间'" range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                            :picker-options="item.isMonth == 1 ? pickerMonthOptions : pickerTimeOptions" />
                        <el-cascader
                            v-if="item.cssType === 'cascader'" v-model="queryData[attributeName[index]]"
                            size="small" placeholder="请选择"
                            filterable clearable
                            :options="item.options"
                            :props="{ checkStrictly: true, emitPath: true, value: 'id', label: 'categoryName'}" />
                        <!-- :show-all-levels="false" :filterable="item.isUrl !== '1'"
                             :props="cascaderPropsFn(item)" -->
                        <InputRangeNumber
                            v-if='item.cssType === "InputRangeNumber"'
                            v-model="queryData[attributeName[index]]" :precision='Number(item["precision"])' />
                    </SearchRequirement>
                </li>
            </transition>
            <slot></slot>
        </ul>
        <div style="display: flex;">
            <div class="ui-main-search-btn ui-btn-chose">
                <el-button size="mini" @click="handleQuery(true)">
                    重置
                </el-button>
                <el-button
                    size="mini" type="primary"
                    @click="handleQuery(false)">
                    查询
                </el-button>
            </div>

            <div class="ui_ComSearchSlotBnt">
                <ComSearchSlotBnt ref="ComSearchSlotBnt" />
            </div>
        </div>
    </div>
</template>
<script>
import Store from '@/store';
import {mapGetters} from 'vuex';
import {getfields, getSearchList} from '../../api/comsearch';
import {defaultAllconfig, defaultConfig, defaultConfigArr, defaultQueryParams} from './dataConfig';
import http from '@/http';
import {pickerMonthOptions, pickerTimeOptions} from './dataConfig.js';
import {handleQueryUrl, handleUrlParm} from './util';

export default {
    name: 'ComSearchCondition',
    props: {
        componentName: {
            type: String,
            default () {
                return '';
            },
        },
        searchListType: { // 每个页面的页签类型
            type: Number,
            default: 0,
        },
    },
    data () {
        return {
            queryData: {},
            attributeName: [],
            advancedFilter: false,
            isInitialize: true,
            pickerTimeOptions: pickerTimeOptions,
            pickerMonthOptions: pickerMonthOptions,

            mainData: [],
            regionBntData: {},
            regionBntShow: false,
            regionQueryData: {},
        };
    },
    computed: {
        ...mapGetters(['searchConfig']),
        checkMainData: {
            get () {
                return this.$store.state.checkedMainData;
            },
        },
        routePath () {
            return '/' + this.componentName;
        },
    },
    watch: {
        async checkMainData (n) {
            if (!this.searchListType) {
                if (this.routePath === this.$route.path) {
                    this.mainData = n.filter((item) => {
                        if (item.cssType === 'regionBnt') {
                            this.regionBntData[item.htmlName] = item;
                        }
                        return item.cssType !== 'regionBnt';
                    });
                    this.regionBntShow = true;

                    await this.handleTransformData(this.mainData);
                    await this.handleSettingQueryData(this.mainData);
                    await this.handleSettingDefaultQueryDataParams();
                }
            } else {
                if (this.searchConfig[this.$route.path][this.componentName] != undefined) {
                    this.mainData = await this.searchConfig[this.$route.path][this.componentName].main_data;
                    await this.handleTransformData(this.mainData);
                    await this.handleSettingQueryData(this.mainData);
                    await this.handleSettingDefaultQueryDataParams();
                }
            }
        },
        '$route.fullPath' (n) {
            if (n) {
                if ((this.$route.path === this.routePath) && this.$route.query._cacheType === '1') {
                    this.handleRrefreshRouting();
                }
            }
        },
    },
    created () {
        this.handleQuerySearchList();
    },
    methods: {
        // 多行文本处理
        textareaInput (event, key) {
            // console.log(event.replace(/\n/g, ','), key);
            this.queryData[key] = event.replace(/(\n|，| )/g, ',');
        },
        // 是否开启 远程搜索
        isRemote (item) {
            if (item.urlAddress != '' && item.isUrl == '0') {
                return true;
            } else {
                return false;
            }
        },
        handleChange (item, val) {
            const pid = Object.keys(defaultConfig).find((item) => { return defaultConfig[item] === this.routePath; });
            // wish刊登- 自动屏蔽补货设置 - 海外仓自动屏蔽补货设置 发货大仓 与 发货子仓 是联动关系
            if (pid && pid == 12 && item.htmlName == 'warehouse_id') {
                this.handleCascaderSelectChange(item, val, true);
            }
        },
        async handleQuery (isReset) {
            if (isReset) {
                this.queryData = {};
                this.regionQueryData = {};
                this.handleResetQueryCondition();
                this.$emit('handleResetQueryInfo');
                this.$refs.ComSearchSlotBnt.handleResetQueryParms();
            } else {
                let queryData = this.handleEmitQueryData();
                Object.keys(queryData).forEach((i) => {
                    const isNull = queryData[i] !== 0 && !queryData[i];
                    const isNoLength = Object.prototype.toString.call(queryData[i]) === '[object Array]' && !queryData[i].length;
                    if (isNull || isNoLength) {
                        delete queryData[i];
                    } else if (Array.isArray(queryData[i])) {
                        queryData[i] = queryData[i].map((i) => {
                            if (i != undefined || i != null) {
                                return i;
                            } else {
                                return '';
                            }
                        });
                    }
                });
                let id = '';
                Object.keys(defaultAllconfig).forEach((i) => { if (defaultAllconfig[i] === this.routePath) { id = i; } });
                queryData.pid = id;
                // 区域筛选的条件合并
                queryData = {...this.regionQueryData, ...queryData};
                this.$emit('handleQueryInfo', queryData);
            }
        },
        // 外部获取 已选的搜索条件（未点查询）未点查询 点击导出
        returnData () {
            const returnObj = {...this.queryData, ...this.regionQueryData};
            Object.keys(returnObj).forEach((i) => {
                const isNull = returnObj[i] !== 0 && !returnObj[i];
                const isNoLength = Object.prototype.toString.call(returnObj[i]) === '[object Array]' && !returnObj[i].length;
                if (isNull || isNoLength) {
                    delete returnObj[i];
                } else if (Array.isArray(returnObj[i])) {
                    returnObj[i] = returnObj[i].map((i) => {
                        if (i != undefined || i != null) {
                            return i;
                        } else {
                            return '';
                        }
                    });
                }
            });
            return returnObj;
        },
        // 查询默认搜索
        handleQuerySearchList () {
            const pid = Object.keys(defaultConfig).find((item) => { return defaultConfig[item] === this.routePath; });
            // if (pid) {
            //     getSearchList({pid}).then(({data}) => {
            //         if (data.status !== 1) {
            //             this.$message.error(data.errorMess);
            //             return;
            //         }
            //         let arr = [];
            //         if (Object.prototype.toString.call(data.data_list) === '[object Array]') {
            //             data.data_list.map((item) => {
            //                 arr = arr.concat(item.fields);
            //             });
            //         } else if (Object.prototype.toString.call(data.data_list) === '[object Object]') {
            //             arr = data.data_list.fields;
            //         } else {
            //             this.$message.error('搜索配置格式返回有问题');
            //         }
            //         data.main_data = arr;
            //         data.all_data = arr;
            //         data.original_data = data.data_list; // 原始数据
            //         this.handleSaveSearchData(data);
            //     }).catch((error) => { this.$message.error('Has Error'); });
            // } else {
            //     // return this.$message.warning('当前页面获取不到搜索配置');
            // }
            const data = {
                'data_list': {
                    'category': '',
                    'key': '',
                    'fields': [
                        {
                            'name': '',
                            'isDefaultShow': '',
                            'select': '1',
                            'firstData': '',
                            'isCaderser': '0',
                            'caderserString': '',
                            'attributeName': '创建人',
                            'htmlName': 'userNumber',
                            'cssType': 'select',
                            'precision': null,
                            'searchType': '1',
                            'isDatetime': '0',
                            'isSelect': '0',
                            'isUrl': '0',
                            'searchRequest': null,
                            'urlAddress': '',
                            'selectData': [
                                {
                                    'id': 'W01205',
                                    'value': '聂云',
                                },
                                {
                                    'id': 'C10500',
                                    'value': '刘鑫岚',
                                },
                                {
                                    'id': 80343,
                                    'value': '李昱莹',
                                },
                                {
                                    'id': 80354,
                                    'value': '肖媛',
                                },
                            ],
                            'checked': 'false',
                        },
                        {
                            'name': '',
                            'isDefaultShow': '',
                            'select': '1',
                            'firstData': '',
                            'isCaderser': '0',
                            'caderserString': '',
                            'attributeName': '大仓',
                            'htmlName': 'warehouse_category_id',
                            'cssType': 'select',
                            'precision': null,
                            'searchType': '1',
                            'isDatetime': '0',
                            'isSelect': '0',
                            'isUrl': '0',
                            'searchRequest': null,
                            'urlAddress': '',
                            'selectData': [
                                {
                                    'id': 2,
                                    'value': '英国仓',
                                },
                                {
                                    'id': 3,
                                    'value': '美国仓',
                                },
                            ],
                            'checked': 'false',
                        },
                        {
                            'name': '',
                            'isDefaultShow': '',
                            'select': '1',
                            'firstData': '',
                            'isCaderser': '0',
                            'caderserString': '',
                            'attributeName': '大仓类型',
                            'htmlName': 'warehouse_type',
                            'cssType': 'select',
                            'precision': null,
                            'searchType': '1',
                            'isDatetime': '0',
                            'isSelect': '0',
                            'isUrl': '0',
                            'searchRequest': null,
                            'urlAddress': '',
                            'selectData': [
                                {
                                    'id': 1,
                                    'value': '国内仓',
                                },
                                {
                                    'id': 2,
                                    'value': '海外仓',
                                },
                            ],
                            'checked': 'false',
                        },
                        {
                            attributeName: '更新时间',
                            caderserString: '',
                            checked: 'false',
                            cssType: 'inputDate',
                            firstData: '',
                            htmlName: 'update_date',
                            id: '4f5227dc-d8ef-2e99-80e7-1e4fcf447651',
                            isCaderser: '0',
                            isDatetime: '0',
                            isDefaultShow: '',
                            isSelect: '0',
                            isUrl: '0',
                            name: '',
                            precision: null,
                            searchRequest: null,
                            searchType: '1',
                            select: '1',
                            selectData: '',
                            urlAddress: '',
                        },
                        {
                            attributeName: 'Tags',
                            caderserString: '',
                            checked: 'false',
                            cssType: 'input',
                            firstData: '',
                            htmlName: 'product_tags',
                            id: 'bae56463-7813-8a5a-acd9-632ccfb494a3',
                            isCaderser: '0',
                            isDatetime: '0',
                            isDefaultShow: '',
                            isSelect: '0',
                            isUrl: '0',
                            name: '',
                            precision: null,
                            searchRequest: null,
                            searchType: '1',
                            select: '0',
                            selectData: '',
                            urlAddress: '',
                        },
                        {
                            attributeName: 'Reviews评分',
                            caderserString: '',
                            checked: 'false',
                            cssType: 'InputRangeNumber',
                            firstData: '',
                            htmlName: 'average_score',
                            isCaderser: '0',
                            isDatetime: '0',
                            isDefaultShow: '',
                            isSelect: '0',
                            isUrl: '0',
                            name: '',
                            precision: 2,
                            searchRequest: null,
                            searchType: '1',
                            select: '2',
                            selectData: '',
                            urlAddress: '',
                        },
                    ],
                },
            };
            let arr = [];
            if (Object.prototype.toString.call(data.data_list) === '[object Array]') {
                data.data_list.map((item) => {
                    arr = arr.concat(item.fields);
                });
            } else if (Object.prototype.toString.call(data.data_list) === '[object Object]') {
                arr = data.data_list.fields;
            } else {
                this.$message.error('搜索配置格式返回有问题');
            }
            data.main_data = arr;
            data.all_data = arr;
            data.original_data = data.data_list; // 原始数据
            this.handleSaveSearchData(data);
        },
        // 保存搜索配置数据
        handleSaveSearchData (data) {
            if (this.searchListType) {
                this.searchConfig[this.$route.path] = this.searchConfig[this.$route.path] || {};
                this.searchConfig[this.$route.path].list_type = this.searchListType;
                this.searchConfig[this.$route.path][this.componentName] = {
                    all_data: data.all_data,
                    main_data: data.main_data,
                    orgin_all_data: JSON.parse(JSON.stringify(data.all_data)),
                };
            } else {
                this.searchConfig[this.$route.path] = {
                    all_data: data.all_data,
                    main_data: data.main_data,
                    orgin_all_data: JSON.parse(JSON.stringify(data.all_data)),
                    original_data: data.original_data,
                };
            }
            Store.commit('SAVE_COMMON_SEARCH_CONFIG', this.searchConfig);
            Store.commit('SAVE_SEARCH_CONFIG_ITEMS', data.all_data);
            Store.commit('SAVE_CHECK_MAINDATA', data.main_data);
        },
        // 处理转化返回如下拉框等数据格式
        handleTransformData (main_data) {
            return new Promise((resolve, reject) => {
                if (Array.isArray(main_data)) {
                    Promise.all(
                        main_data.map((item, index) => {
                            if (item.cssType === 'input' && item.isDatetime === '1') {
                                item.cssType = 'inputDate';
                            }
                            if (item.cssType === 'select') {
                                if (item.selectData) {
                                    if (Array.isArray(item.selectData)) {
                                        try {
                                            item.optionValue = item.selectData;
                                            item.originOptionValue = item.optionValue;
                                        } catch (err) {
                                            console.log('json解析出错1');
                                        }
                                    } else {
                                        // 处理数据格式
                                        let keys = [];
                                        const obj = {};
                                        const optData = [];
                                        keys = Object.keys(item.selectData);
                                        for (const i of keys) {
                                            obj.id = i;
                                            obj.value = item.selectData[i];
                                            optData.push(JSON.parse(JSON.stringify(obj)));
                                        }
                                        item.optionValue = optData;
                                        item.originOptionValue = item.optionValue;
                                    }
                                } else if (!item.optionValue && item.urlAddress) {
                                    item.optionValue = [];
                                    return this.handleGetOption(item, '', null, item.firstData);
                                }
                            } else if (item.cssType === 'cascader' && !item.options) {
                                item.options = [];
                                return this.handleGetCascaderOption(item);
                            }
                        }).filter((v) => { return v; })).then(() => {
                        resolve(1);
                    });
                    Store.commit('SAVE_CHECK_SEARCH_INFO', main_data.map((item) => { return item.htmlName; }));
                }
            });
        },

        // 设置查询对象
        handleSettingQueryData (main_data) {
            const queryData = {};
            this.attributeName = main_data.map((item) => {
                if (this.queryData[item.htmlName]) {
                    queryData[item.htmlName] = this.queryData[item.htmlName];
                } else {
                    if (item.isDatetime === '1' || ((item.cssType === 'select' && item.select === '2')
                    || item.cssType === 'cascader' || item.cssType === 'InputRangeNumber')) {
                        queryData[item.htmlName] = [];
                    } else {
                        queryData[item.htmlName] = '';
                    }
                    // firstData 下拉框默认选择值(后端有返回默认值)
                    if ((item.cssType === 'select' && item.select !== '2') && item.firstData) {
                        queryData[item.htmlName] = item.firstData;
                    }
                }
                return item.htmlName;
            });
            this.queryData = {...queryData};
            this.handleResetQueryCondition();
            this.dynamicAddSeleteIconClass();
            this.$emit('handleLoadOk');
        },
        // 下拉框请求
        async handleGetOption (item, query, callback, isFirstData) {
            if (!(query || query === ' ') && !isFirstData) { return; }
            let url = item.urlAddress;
            let param = {};
            typeof (query) === 'object' ? param = query : param = {account_name: query};
            param = {...param, ...handleUrlParm(url)};
            url = handleQueryUrl(item.urlAddress);
            // console.log('URL0:', url, '参数0：', param);
            const cascaderItem = item.caderserString ? this.getCascaderItem(item) : '';
            if (cascaderItem) {
                if (!this.queryData[cascaderItem.htmlName]) { return; }
                const key = cascaderItem.htmlName;
                param[key] = this.queryData[cascaderItem.htmlName];
            }
            await http.postAjax(url, param).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
                    return;
                }
                item.optionValue = item.cacheSelectItem && item.cacheSelectItem.length ?
                    [...data.data_list.filter((i) => { return item.cacheSelectItem.map((j) => { return j.id; }).indexOf(i.id) === -1; }),
                        ...item.cacheSelectItem] : data.data_list;
                this.mainData = [...this.mainData];
                // this.handleCacheSelectData(item);
                this.$emit('handleDropDownData', item);
                callback ? callback(item) : '';
            });
        },
        // 级联提示
        handleSelectFocus (item) {
            this.queryData = {...this.queryData};
            const cascaderItem = this.getCascaderItem(item);
            if (cascaderItem) {
                if (!this.queryData[cascaderItem.htmlName] || !this.queryData[cascaderItem.htmlName].length) {
                    this.$message.warning(`请先选择${cascaderItem.attributeName}!`);
                    return;
                }
            }
            if (item.originOptionValue && !item.optionValue.length) {
                item.optionValue = item.originOptionValue;
                this.mainData = [...this.mainData];
            }
        },
        // 处理级联默认请求
        handleGetCascaderOption (item) {
            const param = {...handleUrlParm(item.urlAddress)};
            const url = handleQueryUrl(item.urlAddress);
            http.postAjax(url, param).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
                    return;
                }
                item.options = data.data_list;
                this.mainData = [...this.mainData];
                // this.handleCacheSelectData(item);
            });
        },
        // 缓存下拉数据
        handleCacheSelectData (item) {
            const copyConfig = this.searchConfig.all_data[this.routePath].map((_item) => {
                if (_item.htmlName === item.htmlName) {
                    return {...item};
                }
                return _item;
            });
            this.searchConfig.all_data[this.routePath] = copyConfig;
            this.$store.commit('SAVE_COMMON_SEARCH_CONFIG', this.searchConfig);
        },
        // 高级筛选
        handleButtonChose () {
            this.advancedFilter = !this.advancedFilter;
            this.dynamicAddSeleteIconClass();
            this.$emit('handleLoadOk');
        },
        // 动态添加下拉框
        dynamicAddSeleteIconClass () {
            this.$nextTick().then(() => {
                const searchArea = document.getElementsByClassName('ui-search-area')[0];
                const selectRemoteTags = searchArea.getElementsByClassName('el-icon-');
                for (let i = 0; i < selectRemoteTags.length; i++) {
                    const item = selectRemoteTags[i];
                    let attribute = item.getAttribute('class');
                    attribute = attribute.concat(' el-icon-arrow-up');
                    item.setAttribute('class', attribute);
                }
            });
        },
        handleClear () {
            this.dynamicAddSeleteIconClass();
        },
        // 设置默认的查询参数
        handleSettingDefaultQueryDataParams () {
            if (!this.isInitialize) { return; }
            this.isInitialize = false;
            if (this.$route.query._cacheType) {
                this.handleRrefreshRouting();
            } else {
                const temp = defaultQueryParams[Object.keys(defaultAllconfig).find((e) => { return defaultAllconfig[e] === this.routePath; })];
                if (temp) {
                    temp.fn(this.queryData);
                }
                const pid = Object.keys(defaultConfig).find((item) => { return defaultConfig[item] === this.routePath; });
                // 在线listing管理 跟 已下架listing管理 点击菜单进入不默认请求列表数据
                if (pid != '1' && pid != '6') {
                    this.handleQuery(false);
                }
            }
        },
        // 缓存选中的数据
        handleSelectChange (item, val) {
            this.mainData = [...this.mainData];
            item.cacheSelectItem = item.optionValue.filter((item) => { return val.indexOf(item.id) !== -1; });
        },
        handleCascaderSelectChange (item, val, isClear = false) {
            const key = item.htmlName;
            const params = {};
            params[key] = val;
            let arr = [];
            let idArr = [];
            if (!item.caderserString) { return; }
            try {
                JSON.parse(item.caderserString);
                idArr = JSON.parse(item.caderserString);
            } catch (err) {
                idArr = [item.caderserString];
            }
            Object.prototype.toString.call(idArr) === '[object Array]' ? arr = idArr : arr.push(item.caderserString);
            arr.forEach((i) => {
                const cascaderItem = this.mainData.find((_item) => { return i == _item.htmlName; });
                if (!cascaderItem) { return; }
                // 清空级联数据
                cascaderItem.select === '2' ? this.queryData[cascaderItem.htmlName] = [] : this.queryData[cascaderItem.htmlName] = '';
                cascaderItem.optionValue = [];
                cascaderItem.originOptionValue = [];
                if (cascaderItem.cacheSelectItem) {
                    cascaderItem.cacheSelectItem = [];
                }
                // 清空不需要再次请求
                if (!val) { return; }
                if (['warehouse_child_id'].includes(cascaderItem.htmlName) && isClear) {
                    cascaderItem.selectData = '';
                }
                if (Object.prototype.toString.call(cascaderItem.selectData) === '[object Array]' && cascaderItem.selectData.length) {
                    cascaderItem.optionValue = cascaderItem.selectData;
                } else if (Object.prototype.toString.call(cascaderItem.selectData) === '[object String]' && cascaderItem.selectData && JSON.parse(cascaderItem.selectData)) {
                    cascaderItem.optionValue = JSON.parse(cascaderItem.selectData)[val];
                } else {
                    this.handleGetOption(cascaderItem, params, this.handleCallback);
                }
            });
        },
        // 请求回调
        handleCallback (item) {
            // 保存初始数据
            item.originOptionValue = item.optionValue;
        },
        // 清空级联数据
        handleResetQueryCondition () {
            const cascaderItemArr = this.mainData.filter((_item) => { return _item.caderserString !== '0'; });
            cascaderItemArr.forEach((item) => {
                let idArr = [];
                let arr = [];
                if (!item.caderserString) { return; }
                try {
                    JSON.parse(item.caderserString);
                    idArr = JSON.parse(item.caderserString);
                } catch (err) {
                    console.log('json解析出错2');
                    idArr = [item.caderserString];
                }
                Object.prototype.toString.call(idArr) === '[object Array]' ? arr = idArr : arr.push(item.caderserString);
                arr.forEach((i) => {
                    const cascaderItem = this.mainData.find((_item) => { return _item.htmlName === i; });
                    if (cascaderItem && cascaderItem.cssType != 'select') {
                        cascaderItem.optionValue = [];
                        cascaderItem.originOptionValue = [];
                        if (cascaderItem.cacheSelectItem) {
                            cascaderItem.cacheSelectItem = [];
                        }
                    }
                });
            });
            this.queryData = {...this.queryData};
        },
        // 带参数路由跳转页面刷新,只保留当前跳转条件的查询参数
        async handleRrefreshRouting () {
            const param = this.$route.query;
            const itemArr = this.mainData.filter((item) => { return item.urlAddress && param[item.htmlName]; });
            for (let i = 0; i < itemArr.length; i++) {
                const item = itemArr[i];
                if (Array.isArray(param[item.htmlName])) {
                    await this.handleGetOption(item, {id: param[item.htmlName][0]});
                } else {
                    await this.handleGetOption(item, {id: param[item.htmlName]});
                }
            }
            // 设置查询值
            const queryParams = Object.keys(this.$route.query);
            const queryData = {};
            queryParams.forEach((item) => {
                if (typeof (param[item]) !== 'undefined' && this.queryData[item] !== 'undefined') {
                    // 多选下拉框值为字符串的格式
                    if (Object.prototype.toString.call(this.queryData[item]) === '[object Array]') {
                        // 统一值类型
                        const formItem = this.mainData.find((i) => { return i.htmlName === item; });
                        if (formItem.optionValue && formItem.optionValue.length && formItem.css_type === 'select') {
                            if (Object.prototype.toString.call(formItem.optionValue[0].id) === '[object String]') {
                                param[item] = param[item].map((i) => { i = i + ''; return i; });
                            } else {
                                param[item] = param[item].map((i) => { i = Number(i); return i; });
                            }

                        }
                    }
                    (Object.prototype.toString.call(this.queryData[item]) === '[object String]'
                        && Object.prototype.toString.call(param[item]) === '[object Array]') ?
                        queryData[item] = param[item][0] :
                        (Object.prototype.toString.call(this.queryData[item]) === '[object Array]'
                        && Object.prototype.toString.call(param[item]) === '[object String]') ?
                            queryData[item] = [param[item] + ''] :
                            queryData[item] = param[item];
                }
            });

            this.queryData = queryData;
            this.handleQuery(false);
        },
        // 处理级联组件的传值数据格式
        handleEmitQueryData () {
            const cascaderArr = this.mainData.filter((item) => { return item.cssType === 'cascader'; });
            const queryData = {...this.queryData};
            cascaderArr.forEach((item) => {
                // 有自定义传值字段htmlName,取自定义传值字段htmlName
                if (queryData[item.htmlName] && (item.options[0] && item.options[0].htmlName)) {
                    const orginQueryDataValue = queryData[item.htmlName];
                    const htmlNameArr = [];
                    const gethtmlNameFn = (arr) => {
                        arr.forEach((item) => {
                            if (htmlNameArr.indexOf(item.htmlName) === -1) {
                                htmlNameArr.push(item.htmlName);
                                if (item.children) {
                                    gethtmlNameFn(item.children);
                                }
                            }
                        });
                    };
                    gethtmlNameFn(item.options, htmlNameArr);
                    // 多个级联字段名
                    htmlNameArr.forEach((i, index) => {
                        orginQueryDataValue[index] ? queryData[i] = orginQueryDataValue[index] : delete queryData[i];
                    });
                }
            });
            return queryData;
        },
        getCascaderItem (item) {
            const cascaderItem = this.mainData.find((_item) => {
                let arr = [];
                let idArr = [];
                try {
                    JSON.parse(_item.caderserString);
                    idArr = JSON.parse(_item.caderserString);
                } catch (err) {
                    console.log('json解析出错3');
                    idArr = [_item.caderserString];
                }
                Object.prototype.toString.call(idArr) === '[object Array]' ? arr = idArr : arr.push(_item.caderserString);
                return arr.indexOf(item.htmlName) !== -1;
            });
            return cascaderItem;
        },

        // 级联配置
        cascaderPropsFn (item) {
            return {
                checkStrictly: true,
                emitPath: false,
                lazy: item.urlAddress,
                lazyLoad (node, resolve) {
                    const {level, value} = node;
                    const param = level > 0 ? {id: value} : {};
                    const url = handleQueryUrl(item.urlAddress);
                    http.postAjax(url, param).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败');
                            return;
                        }
                        resolve(data.data_list || []);
                    });
                },
            };
        },
    },
};
</script>
<style lang="less" scoped>
.ui-search-area .ui-main-search-btn.ui-btn-chose {
    flex: 3;
    margin: 5px 0 0 0 !important;
    text-align: left !important;
}
.ui_ComSearchSlotBnt {
    padding-right: 42px;
    // flex: 1;
    // text-align: center;
}
.ui-search-tips {
    padding-left: 5px;
    font-size: 13px;
    color: #f90;
}
// 针对多行文本input的css
.common-search-Box {
    height: 74px !important;
    /deep/ .ui-search_require .ui-search_label {
        margin-top: -42px !important;
    }
    .common-search-textarea {
        height: 74px;
        /deep/ .el-textarea__inner {
            min-height: 74px !important;
            max-height: 74px !important;
        }
    }
}
/deep/ .common-search-textarea .el-textarea__inner {
    resize: none;  // 取消拉伸高度
}
</style>
