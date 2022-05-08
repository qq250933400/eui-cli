const path = require('path');
const webpack = require('webpack');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require("chalk");

module.exports = {
    plugins: [
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    // 设置出口文件地址与文件名
    output: {
        path: path.resolve(process.cwd(), './dist'),
        filename: 'bundle.min.js'
    },
    mode: "development",
    watch: true,
    watchOptions: {
        aggregateTimeout: 600,
        poll: 1000,
        ignored: [
            path.resolve(__dirname, '../node_modules'),
            path.resolve(__dirname, '../dist'),
            path.resolve(__dirname, '../lib'),
            path.resolve(process.cwd(), '../node_modules'),
            path.resolve(process.cwd(), '../dist'),
            path.resolve(process.cwd(), '../lib')
        ],
    },
    target: "web"
};
