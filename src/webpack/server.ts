// import webpackDevServer from "webpack-dev-server";
import "colors";
import Config from "../core/Config";
import { utils } from "elmer-common";
import { merge } from "webpack-merge";
import { webpack } from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
// const webpackDevServer = require("webpack-dev-server");
const commonConfig = require("../../webpack/webpack.common");
const serviceConfig = require("../../webpack/webpack.config.dev");

export default () => {
    const configObj = new Config();
    const devConfig = configObj.readWebpackConfig();
    let configData = merge(commonConfig, serviceConfig);
    if(devConfig) {
        const devConfigData:any = {};
        if(devConfig.output) {
            devConfigData.output = devConfig.output
        }
        if(!utils.isEmpty(devConfig.devtool)) {
            devConfigData.devtool = devConfig.devtool;
        }
        if((devConfig as any).plugins) {
            devConfigData.plugins = (devConfig as any).plugins;
        }
        devConfigData.entry = devConfig.entry;
        configData = merge(configData, devConfigData);
        if(devConfig.common){
            configData = merge(configData, devConfig.common);
        }
        if(devConfig.dev){
            configData = merge(configData, devConfig.dev);
        }
    }
    const host = devConfig?.devServer?.host || devConfig.host || "0.0.0.0";
    const port = devConfig?.devServer?.port || devConfig.port || 3000;
    const devServer = devConfig.devServer || {
        host,
        port,
        overlay: true,
        open: false,
        hot: true,
        compress: true,
        quiet: false,
        inline: true,
    }
    const compiler = webpack(configData);
    const server = new WebpackDevServer(compiler as any, devServer);
    server.listen(port, host, () => {
        console.log("");
        console.log(`block dev-server listening on  ${host}:${port}`.red);
        console.log("");
    });
};