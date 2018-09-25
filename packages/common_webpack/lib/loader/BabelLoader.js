"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebpackUtils_1 = require("../utils/WebpackUtils");
/**
 * babel-loader
 * @author wxup
 * @create 2018-09-25 9:37
 **/
var babelLoader = {
    test: /\.js[x]?$/,
    exclude: WebpackUtils_1.isExclude,
    use: [
        {
            loader: "babel-loader",
            options: {
                "presets": [
                    [
                        "@babel/preset-env",
                        {
                            "targets": "last 2 versions, ie 11",
                            "modules": false
                        }
                    ]
                ]
            }
        }
    ]
};
exports.default = babelLoader;
