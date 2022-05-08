const path = require('path');
const cleanWebpackPlugin = require("clean-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require("chalk");
const copyWebpackPlugin = require("copy-webpack-plugin");
const ElmerWebpackPlugin = require("../lib/plugin/WebpackDeleteFolder").default;

const rootPath = process.cwd();

const webpackConfig = {
    plugins: [
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: true
        }),
        new cleanWebpackPlugin(
            ["css","font", "img","chunks", "scripts", "script","assets","js"],
            {
                root: path.resolve(rootPath, "./dist"),
                verbose: true,
                dry: false
            }
        ),
        // new copyWebpackPlugin({
        //     patterns: [
        //         { from: "./src/assets", to: "./dist/assets" }
        //     ],
        // }),
        new ElmerWebpackPlugin({
            remove: ["lib"]
        })
    ],
    // 设置出口文件地址与文件名
    output: {
        path: path.resolve(process.cwd(),'./dist'),
        filename: '[name].[chunkhash:8].bundle.min.js',
        chunkFilename: 'chunks/[name].[id].[chunkhash:8].js',
        publicPath: "",
        // globalObject: "this",
        // chunkFormat: "commonjs",
        chunkLoadingGlobal: 'elmer-chunks',
        chunkLoading: 'jsonp',
    },
    optimization: {
        minimize: false,
        runtimeChunk: {
            name:'./script/manifest'
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /\/node_modules\//,
                    name: './script/vendors',
                    chunks: 'all',
                },
            },
        },
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 5000 * 1024,
        maxAssetSize: 5000 * 1024,
    },
    mode: "production"
};

module.exports = webpackConfig;
