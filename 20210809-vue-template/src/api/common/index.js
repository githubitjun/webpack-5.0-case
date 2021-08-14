import http from '@/http';
import CONFIG from '@/assets/js/config';
// import CONFIG from '@/assets/js/config';

/****  POST方式导出文件  ****/
export function postExcelFile(params, url) { //params是post请求需要的参数，url是请求url地址
    let form = document.createElement("form");
    form.style.display = 'none';
    form.action = url;
    form.method = "post";
    document.body.appendChild(form);

    for(let key in params){
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    }
    form.submit();
    form.remove();
}

// 获取前端配置
export function getConfigInfo() {
    return http.getAjax(`${CONFIG.ROOT_URL}/config.json`, {});
}

// 获取公共下拉数据
export function getCommonOptions(params = {}) {
    const data = {
        ...params
    };
    return http.postAjax(`${CONFIG.JAVA_PATH}/coupang/coupang_enum/getcoupangenum`, data,true);
}

