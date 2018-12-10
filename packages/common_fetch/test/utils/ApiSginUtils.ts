import {isNullOrUndefined, isString} from "util";
// import md5 from "md5";
const md5 = require("md5");

/**
 * ap请求时签名
 * @param fields 需要签名的列
 * @param params 请求参数
 * @param clientSecret
 * @return {string}
 */
export function apiSign(fields: Array<string>, params: any, clientSecret: string): string {
    console.log("需要签名的列->", fields);
    if (isNullOrUndefined(fields)) {
        return "";
    }
    let value = "";
    fields.sort().forEach(function (item) {
        let param = params[item.toString()];
        if (isNullOrUndefined(param) || (isString(param) && param.trim().length === 0)) {
            // console.warn("参与签名的参数：" + item + " 未传入!");
            throw new Error("参与签名的参数：" + item + " 未传入或值无效!");
        }
        value += `${item}=${param}&`;
    });
    //加入clientId 、clientSecret 时间戳参与签名
    value += `clientId=${params.clientId}&clientSecret=${clientSecret}&timestamp=${params.timestamp}`;

    let channelCode: string = params.channelCode;
    if (!!channelCode) {
        //加入渠道编号
        value += `&channelCode=${channelCode}`;
    } else {
        console.warn("签名时channelCode未传入");
    }

    return md5(value);
}
