"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack = require("webpack");
var path = require("path");
var BabelLoader_1 = require("../../loader/BabelLoader");
var TypescriptLoader_1 = require("../../loader/TypescriptLoader");
var CssModuleUtils_1 = require("../../style/CssModuleUtils");
var ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
var ThemeConfig_1 = require("../../style/ThemeConfig");
var VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
var bannerPlugin = new webpack.BannerPlugin({
    banner: '// { "framework": "Vue" }\n',
    raw: true
});
var postcssPluginWeex = require('postcss-plugin-weex');
var autoprefixer = require('autoprefixer');
var postcssPluginPx2Rem = require('postcss-plugin-px2rem');
var postcssLoader = {
    loader: "postcss-loader",
    options: {
        plugins: [
            postcssPluginWeex(),
            //使用.browserslistrc的统一配置
            autoprefixer(),
            postcssPluginPx2Rem({ rootValue: 75, minPixelValue: 1.01 })
        ],
        ident: "css-loader"
    }
};
var weexVuePrecompiler = require('weex-vue-precompiler')();
var webpackConfig = {
    entry: {
        app: path.resolve('src', 'Main'),
    },
    output: {
        path: path.resolve('dist_web'),
        filename: '[name].web.js'
    },
    resolve: {
        extensions: [".ts", ".tsx", "d.ts", ".js", ".vue", ".css", ".scss", ".less", ".png", "jpg", ".jpeg", ".gif"],
    },
    module: {
        rules: [
            BabelLoader_1.default,
            {
                test: /\.vue(\?[^?]+)?$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            optimizeSSR: false,
                            compilerOptions: {
                                modules: [
                                    {
                                        postTransformNode: function (el) {
                                            weexVuePrecompiler(el);
                                        }
                                    }
                                ]
                            },
                        }
                    }
                ]
            },
            TypescriptLoader_1.default,
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    CssModuleUtils_1.cssModuleLoader,
                    postcssLoader
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    CssModuleUtils_1.cssModuleLoader,
                    postcssLoader,
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            javascriptEnabled: true,
                            modifyVars: ThemeConfig_1.getThemeConfig()
                        }
                    }
                ]
            },
            {
                test: /\.s[c|a]ss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    CssModuleUtils_1.cssModuleLoader,
                    postcssLoader,
                    {
                        loader: "sass-loader",
                        options: {
                            ident: "sass-loader"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        bannerPlugin,
        new ExtractTextWebpackPlugin({
            filename: "[name].css",
            allChunks: true
        }),
    ]
};
webpackConfig.mode = "development";
exports.default = webpackConfig;
