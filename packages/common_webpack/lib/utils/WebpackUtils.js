"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var webpackConfig_1 = require("../config/webpackConfig");
//默认导入的模块
var DEFAULT_INCLUDE = [
    "common_",
    "oak_"
];
var list = DEFAULT_INCLUDE.slice();
if (process.env._self !== "1") {
    if (webpackConfig_1.INCLUDE_PATH) {
        list.push.apply(list, webpackConfig_1.INCLUDE_PATH);
    }
}
/**
 * loader是否忽略该文件
 * @param path 文件路径
 * @return {boolean} true 忽略 false 不忽略
 */
exports.isExclude = function (path) {
    //是否为node_modules中的模块
    var isNodeModules = path.indexOf("node_modules") >= 0;
    var isWxpComponents = list.some(function (item) {
        return path.indexOf(item) >= 0;
    });
    if (isWxpComponents || path.endsWith("_starter")) {
        return false;
    }
    return isNodeModules;
};
/**
 * 获取项目跟目录
 */
function getProjectRootDir() {
    return path.resolve("./");
}
exports.getProjectRootDir = getProjectRootDir;
