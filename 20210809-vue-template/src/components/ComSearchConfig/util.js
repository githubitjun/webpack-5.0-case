import dayjs from 'dayjs';

/**
 * CaseeLee
 * 设置默认查询参数
 * @param url 查询地址
 */
export const handleSettingDefaultTime = (subtractDay) => {
    const start = dayjs().subtract(subtractDay ? subtractDay : 0, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
    return [start, end];
};
/**
 * CaseeLee
 * 处理查询地址
 * @param url 查询地址
 */
export const handleQueryUrl = (url) => {
    if (!url) { return; }
    let unnecessary = 'api';
    if (url.indexOf(unnecessary) !== -1) {
        url = url.substring(url.indexOf(unnecessary) + unnecessary.length);
    }
    unnecessary = '?';
    if (url.indexOf(unnecessary) !== -1) {
        return url.substring(0, url.indexOf(unnecessary));
    }
    return url;
};
/**
 * CaseeLee
 * 处理查询地址参数
 * @param url 查询地址
 */
export const handleUrlParm = (url) => {
    const params = {};
    const paramsChar = '?';
    const paramsString = url.indexOf('?') !== -1 ? url.substring(url.indexOf(paramsChar) + 1) : '';
    if (paramsString) {
        paramsString.split('&').forEach((item) => {
            const param = item.split('=');
            if (param && param.length) {
                params[param[0]] = param[1];
            }
        });
    }
    return params;
};
