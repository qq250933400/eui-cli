// import webpackDevServer from "webpack-dev-server";
import "colors";
import Config from "../core/Config";
import { utils } from "elmer-common";
import { merge } from "webpack-merge";
import { webpack } from "webpack";
import * as buildConfig from "../../webpack/webpack.config.build";
import * as path from "path";
const commonConfig = require("../../webpack/webpack.common");

export default () => {
    const configObj = new Config();
    const devConfig = configObj.readWebpackConfig();
    let configData = merge(commonConfig, buildConfig);
    if(devConfig) {
        const devConfigData:any = {};
        if(devConfig.output) {
            devConfigData.output = devConfig.output;
            if(/^\.\//.test(devConfigData.output?.path)) {
                devConfigData.output.path = path.resolve(devConfigData.output?.path);
            }
        }
        if(!utils.isEmpty(devConfig.devtool)) {
            devConfigData.devtool = devConfig.devtool;
        }
        if((devConfig as any).plugins) {
            devConfigData.plugins = (devConfig as any).plugins;
        }
        devConfigData.entry = devConfig.entry;
        // devConfigData.optimization = false;
        configData = merge(configData, devConfigData);
        if(devConfig.common){
            configData = merge(configData, devConfig.common);
        }
        if(devConfig.build){
            configData = merge(configData, devConfig.build);
        }
    }
    webpack(configData, (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            return;
        }
        console.log(stats.toString({
            colors: true,
            env: true,
        }));
        const info = stats.toJson();
        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }
    });
};