const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require('wxp_weex_components/webpack-web/webpack.base.config');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const {PROD_API_ADDRESS} = require('./webpack-config/WebpackConfig');

config.plugins.push(
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: "index.html",
        title: "刮刮彩",
        chunks: ["app"],
        inject: false,
    }),
    new UglifyJsPlugin({
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
        compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            warnings: false,
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
        }
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"prod"',
            API_ROOT: JSON.stringify(PROD_API_ADDRESS)
        }
    }));

module.exports = config;
