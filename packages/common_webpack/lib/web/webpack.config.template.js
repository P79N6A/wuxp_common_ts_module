"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var webpack_base_config_1 = require("./webpack.base.config");
var baseConfig = webpack_base_config_1.getWebpackBaseConfig({
    themePath: path.resolve("theme", "index.json")
});
var config = __assign({}, baseConfig);
config.plugins = config.plugins.slice();
config.mode = "development";
exports.default = config;
