import {isNullOrUndefined} from "util";


/**
 * 判断原生能力支持
 * @param modelName 模块名称 必填
 * @param fnNmae    方法名称
 */
export const supportNativeAbility = (modelName, fnNmae = '') => {
    if (isNullOrUndefined(weex.supports)) {
        console.warn("当前weex版本不支持 weex.supports 方法，请检查sdk是否大于0.15");
        return false;
    }
    let s = `@module/${modelName}`;
    if (fnNmae.trim().length > 0) {
        s += "." + fnNmae
    }
    return weex.supports(s);
};


/**
 * 是否支持友盟
 */
export const supportUMeng = () => {
    return supportNativeAbility("umeng");
};