const webpack = require("webpack");
const path = require("path");
const { HtmlParse } = require("elmer-virtual-dom");
const { getCommand } = require("elmer-common/lib/utils");
const parseObj = new HtmlParse();
const devMode = process.env.NODE_ENV !== 'production';
const WebpackCssTransform = require("../lib/plugin/WebpackCssTransform").default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const prefixLoader = { loader: path.resolve(__dirname, '../loader/CssPrefixLoader.js') };
const cssLoader = {
    loader: "css-loader",
    options: {
        modules: {
            localIdentName: '[name]__[local]--[hash:base64:5]'
        }
    }
};
// 对babel的配置，内容同.babelrc文件
const babelOptions = {
    babelrc: false,
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        ["@babel/plugin-proposal-class-properties", { "loose": false }],
        "@babel/plugin-proposal-json-strings"
    ],
    presets: [
        [
            "@babel/preset-env",
            {
                "modules": "commonjs",
                "targets": {
                    "browsers": [
                        "last 2 version",
                        "> 1%",
                        "iOS >= 7",
                        "Android > 4.1",
                        "Firefox > 20"
                    ]
                }
            }
        ]
    ],
};

const webpackCommonConfig = {
    // 使用 source-map
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify(getCommand(process.argv, "env")),
            NODE_ENV: process.env.NODE_ENV,
            devMode
        }),
        new webpack.DefinePlugin({
            template: function (tplFileName) {
                return require(tplFileName);
            }
        }),
        new WebpackCssTransform()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    { loader: 'tslint-loader' }
                ]
            }, {
                test: /\.js$/,
                use: [
                    { loader: "babel-loader", options: babelOptions },
                    {
                        loader: "elmer-loader",
                        options: {
                            parse: function (source) {
                                return parseObj.parse(source);
                            }
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    },
                    {
                        loader: 'ts-loader'
                    },
                    {
                        loader: "elmer-loader",
                        options: {
                            parse: function (source) {
                                return parseObj.parse(source);
                            }
                        }
                    }
                ]
            }, {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./css",
                            emit: true,
                            esModule: true
                        }
                    },
                    cssLoader,
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./css",
                            emit: true,
                            esModule: true
                        }
                    },
                    cssLoader,
                    'postcss-loader',
                    'less-loader'
                ]
            }, {
                test: /\.(woff|woff2|ttf|eot)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 400,
                            outputPath: "./font",
                            publicPath: "../font"
                        }
                    }
                ]
            }, {
                test: /\.(jpg|bmp|gif|png|svg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 400,
                            outputPath: "./img",
                            publicPath: "../img"
                        }
                    }
                ]
            },
            {
                test: /\.(html|htm)$/i,
                use: [
                    {
                        loader: "elmer-loader",
                        options: {
                            parse: function (source) {
                                return parseObj.parse(source);
                            }
                        }
                    }
                ]
            },
            {
                test: /\.d\.ts$/,
                loader: 'ignore-loader'
            }
        ],
        generator: {
            asset: {
                publicPath: 'assets/',
            }
        }
    },
    resolve: {
        fallback: {
            path: require.resolve("path"),
            fs: require.resolve("fs"),
            url: require.resolve("url"),
            util: require.resolve("util")
        },
        aliasFields: ['browser'],
        extensions: [".js",".ts",".jsx",".tsx",".json",".eui",".less", ".css"]
    }
};

module.exports = webpackCommonConfig;
