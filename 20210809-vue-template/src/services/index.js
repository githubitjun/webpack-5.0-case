import * as Storage from '@/utils/storage';
import CONFIG from '@/assets/js/config'
import qs from 'qs';
import Store from '../store';
import { printCodeHtml, getPrintView } from '@/api/common';
import araleQrcode from 'arale-qrcode';

// 表格INX
export function autoAddTableInx(inx) {
    let i = parseInt(inx) + 1 + '';
    let first = '0';
    return first.repeat(4 - i.length) + i
}

// 获取默认时间
export function getDefaultTime(callBack, value = 'Y-M-D') {
    let nowTime = new Date();
    let year = nowTime.getFullYear();
    let month = nowTime.getMonth() + 1;
    let nowDay = nowTime.getDate();
    let [isYear, isMonth, isDay] = [value.indexOf('Y') > -1, value.indexOf('M') > -1, value.indexOf('D') > -1];
    let date1 = `${isYear ? year : ' '}-${isMonth ? month : ' '}-${isDay ? '01' : ''}`.replace(/[-\s]{2}/, '').replace(/((^\s+-)|(\s+-$)|(-$))/, '');
    let date2 = `${isYear ? year : ' '}-${isMonth ? month : ' '}-${isDay ? nowDay : ''}`.replace(/[-\s]{2}/, '').replace(/((^\s+-)|(\s+-$)|(-$))/, '');

    let hour = nowTime.getHours();
    let minute = nowTime.getMinutes();
    let second = nowTime.getSeconds();

    let [isHour, isMinute, isSecond] = [value.indexOf('h') > -1, value.indexOf('m') > -1, value.indexOf('s') > -1];
    let dateTs = `${isHour ? '00' : ' '}:${isMinute ? '00' : ' '}:${isSecond ? '00' : ''}`.replace(/[:\s]{2}/, '').replace(/((^\s+:)|(\s+:$))/, '');
    let dateTe = `${isHour ? hour : ' '}:${isMinute ? minute : ' '}:${isSecond ? second : ''}`.replace(/[:\s]{2}/, '').replace(/((^\s+:)|(\s+:$))/, '');

    let dateS = date1 + (dateTs && date1 ? ' ' + dateTs : dateTs);
    let dateE = date2 + (dateTe && date2 ? ' ' + dateTe : dateTe);

    callBack && callBack(dateS && dateE ? { start: dateS, end: dateE } : { start: '0000-10-17', end: '9999-10-17' })
}

//获取指定日期的相差多少天的日期
export function addByTransDate(dateParameter, num) {
    var translateDate = "", dateString = "", monthString = "", dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/"); ;
    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate - num * 24 * 60 * 60 * 1000; //备注e799bee5baa6e997aee7ad94e58685e5aeb931333363376364 如果是往前计算日期则为减号 否则为加号
    newDate = new Date(newDate);
    //如果月份长度少于2，则前加 0 补位
    if ((newDate.getMonth() + 1).toString().length == 1) {
    monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
    monthString = (newDate.getMonth() + 1).toString();
    }
    //如果天数长度少于2，则前加 0 补位
    if (newDate.getDate().toString().length == 1) {
    dayString = 0 + "" + newDate.getDate().toString();
    } else {
    dayString = newDate.getDate().toString();
    }
    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
    return dateString;
}

// 获取地址栏参数
export function getAddressModelParams() {
    let path = window.location.search;
    let pathParams = path.substring(path.indexOf('?') + 1, path.length);
    return qs.parse(pathParams)
}


// 获取本地IP todo 谷歌80版本以上获取不了
export function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    let myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    let pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //sten for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

/**
 * 计算表格高度
 * @_e { string }
 * @other { array }
 * @_d { boolean } 是否不计算默认内容
 * */
export function countTableHeight(_e, other, _d = false) {

    let extra = _d ? [] : ['ui-search-area', 'ui-fn-module', 'ui-main-module-page'];

    if (other && other.length) {
        extra = extra.concat(other);
    }

    let mainView = window.getEleAttr(`.${_e}`);
    let tableHeight = CONFIG.HEIGHT_INFO.NAV + CONFIG.HEIGHT_INFO.TAP_HEIGHT + (_d ? 0 : CONFIG.HEIGHT_INFO.TABLE_MARGIN);
    let userAgent = navigator.userAgent;
    for (let i = 0; i < extra.length; i++) {

        // 获取容器元素
        let ele = window.getEleAttr(`.${extra[i]}`, mainView);
        if (!ele) continue;
        tableHeight += ele.offsetHeight;

        let eleMargin, eleTBMargin;
        let eleCss = document.defaultView.getComputedStyle(ele);
        if (userAgent.indexOf('Firefox') > -1) {
            eleTBMargin = parseInt(eleCss['margin-top']) + parseInt(eleCss['margin-bottom']);
        } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf("MSIE") > -1 && !userAgent.indexOf("Opera") > -1) {
            let ieCss = ele.currentStyle;
            eleTBMargin = parseInt(ieCss['marginTop']) + parseInt(ieCss['marginBottom']);
        } else {
            eleMargin = eleCss.margin.split(' ');
            eleTBMargin = parseInt(eleMargin[2]) ? parseInt(eleMargin[0]) + parseInt(eleMargin[2]) : parseInt(eleMargin[0]);
        }

        tableHeight = eleTBMargin + tableHeight;
    }
    tableHeight = window.innerHeight - tableHeight;
    return `${tableHeight}`;
}

// 对比数组对象
export function comparisonArrayObject(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
    return targetarr.some(_ => arr.indexOf(_) > -1)
  }
  
  /**
   * @param {String|Number} value 要验证的字符串或数值
   * @param {*} validList 用来验证的列表
   */
  export function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
      if (value === validList[i]) {
        return true
      }
    }
    return false
  }