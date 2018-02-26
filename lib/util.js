/**
 * Created by ximing on 2/26/18.
 */
'use strict';

/**
 * 返回固定格式的时间
 * @param fmt 时间格式 yyyy-MM-dd hh:mm:ss
 * @param time 时间戳
 * @returns {*}
 */
function formatDateFn(fmt, time) {

    let now;
    if (time) {
        now = new Date(time);
    } else {
        now = new Date();
    }
    let FMT = new Map([['M+', now.getMonth() + 1],//月份
        ['d+', now.getDate()],
        ['h+', now.getHours() % 12 === 0 ? 12 : now.getHours() % 12],//日
        ['H+', now.getHours()],//小时
        ['m+', now.getMinutes()], //小时
        ['s+', now.getSeconds()],//分//秒
        ['q+', Math.floor((now.getMonth() + 3) / 3)],//季度
        ['S', now.getMilliseconds()]]); //毫秒

    let week = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (now.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[now.getDay() + '']);
    }
    for (let [key, value] of FMT) {
        if (new RegExp(`(${key})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (value) : (('00' + value).substr(('' + value).length)));
        }
    }
    return fmt;
}

exports.formatDate = function (fotmatString = 'yyyy-MM-dd hh:mm', time) {
    let difftime = new Date().getTime() - time;
    let timeObj = new Date(time);
    if (difftime <= 180000) {
        return '刚刚';
    } else if (difftime < 86400000 && (new Date()).getDate() === timeObj.getDate()) {
        return `今天 ${timeObj.getHours()}:${timeObj.getMinutes()}`;
    } else {
        return formatDateFn(fotmatString, time);
    }
};

exports.sizeConvert = function (isDir, size) {
    if (isDir) {
        return '-';
    } else {
        size = Number(size) || 0;
        if (size < 0) {
            return '0K';
        }
        if (parseInt(size / 1024) < 1000) {
            return (size / 1024).toFixed(1) + 'K';
        } else if (parseInt(size / 1024 / 1024) < 1000) {
            return (size / 1024 / 1024).toFixed(1) + 'M';
        } else {
            return (size / 1024 / 1024 / 1024).toFixed(1) + 'G';
        }
    }
};
