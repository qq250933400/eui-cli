import file from "../utils/file";
import { utils } from "elmer-common";
import * as path from "path";
import * as htmlWebpackPlugin from "html-webpack-plugin";
import * as  MiniCssExtractPlugin from "mini-css-extract-plugin";

type TypeExportConfigOutput = {
    filename: string;
    publicPath: string;
    chunkFilename: string;
};
type TypeWebpackDevTool = "source-map" | "eval-source-map" | "cheap-module-source-map" | "cheap-module-eval-source-map";

type TypeExportConfig = {
    port?: number;
    host?: string;
    dev?: string;
    build?: string;
    common?: string;
    devtool?: TypeWebpackDevTool,
    optimization?: boolean,
    output?: TypeExportConfigOutput,
    template?: string;
    entry?: string;
    hashFileName?: boolean;
};

type TypeWebpackDevServer = {
    contentBase?: string;
    overlay?: boolean;
    open?: boolean;
    hot?: boolean;
    compress?: boolean;
    quiet?: boolean;
    inline?: boolean;
    port?: number;
    host?: string;
}

type TypeWebpackTemplate = {
    title?: string;
    fileName?: string;
    removeComments?: boolean;
};

type TypeWebpackConfig = {
    port?: number;
    host?: string;
    dev?: object;
    build?: object;
    common?: object;
    devtool?: TypeWebpackDevTool,
    optimization?: boolean,
    output?: TypeExportConfigOutput,
    template?: TypeWebpackTemplate;
    entry?: any;
    devServer?: TypeWebpackDevServer;
};
type TypeStaticBuilderConfig = {
    srcPath: string;
    desPath: string;
}
export default class Config {
    readConfig<T={}>(): T {
        const packageJson = path.resolve(process.cwd(), "./package.json");
        const configData = file.readJson<TypeExportConfig>(packageJson, "eui-cli") || {};
        const rootPath = process.cwd();
        if(configData) {
            if(!utils.isEmpty(configData.dev)) {
                const devModule = require(path.resolve(rootPath,configData.dev));
                if(devModule.default) {
                    configData.dev = devModule.default;
                } else {
                    configData.dev = devModule;
                }
            }
            if(!utils.isEmpty(configData.build)) {
                const buildModule = require(path.resolve(rootPath,configData.build));
                if(buildModule.default) {
                    configData.build = buildModule.default;
                } else {
                    configData.build = buildModule;
                }
            }
            if(!utils.isEmpty(configData.common)) {
                const buildModule = require(path.resolve(rootPath,configData.common));
                if(buildModule.default) {
                    configData.common = buildModule.default;
                } else {
                    configData.common = buildModule;
                }
            }
        }
        return configData as any;
    }
    readWebpackConfig(): TypeWebpackConfig {
        let webpackConfig = this.readConfig<TypeWebpackConfig>();
        if(webpackConfig) {
            const allKeys = [
                "host",
                "port",
                "dev",
                "build",
                "common",
                "devtool",
                "optimization",
                "output",
                "template",
                "entry",
                "devServer",
                "hashFileName"
            ];
            const newConfig = {};
            Object.keys(webpackConfig).map((configKey: string): void => {
                if(allKeys.indexOf(configKey) >= 0) {
                    newConfig[configKey] = webpackConfig[configKey];
                }
            });
            webpackConfig = newConfig;
        } else {
            webpackConfig = {};
        }
        const hashFileName = typeof (webpackConfig as any).hashFileName === "boolean" ? (webpackConfig as any).hashFileName : true;
        const templateConfig = this.readTemplateConfig(webpackConfig.template || {
            title: "Document",
            fileName: "./public/index.html",
            removeComments: false
        }, hashFileName);
        const entryData = this.readEntryConfig(webpackConfig.entry);
        webpackConfig = {
            ...webpackConfig,
            ...templateConfig,
            ...entryData
        };
        return webpackConfig;
    }
    staticBuilderConfig(): TypeStaticBuilderConfig {
        return this.readConfig<any>()?.static || {};
    }
    private readEntryConfig(entryConfig: any) {
        const rootPath = process.cwd();
        if(utils.isString(entryConfig)) {
            return { 
                entry: {
                    "./script/main": !utils.isEmpty(entryConfig) ? path.resolve(rootPath, entryConfig) : path.resolve(rootPath, "./public/index.ts")
                }
            };
        } else if(utils.isObject(entryConfig)) {
            const entryData = {
                entry: {}
            };
            Object.keys(entryConfig).map((entryKey) => {
                entryData.entry[entryKey] = path.resolve(process.cwd(), entryConfig[entryKey]);
            });
            return entryData;
        } else {
            return {
                entry: {
                    "./script/main": path.resolve(rootPath, "./public/index.ts")
                }
            };
        }
    }
    private readTemplateConfig(templateInfo: TypeWebpackTemplate, hashFileName?: boolean) {
        return {
            plugins: [
                new htmlWebpackPlugin({
                    filename: file.getName(templateInfo.fileName),
                    template: path.resolve(process.cwd(), templateInfo.fileName),
                    inject: true,
                    hash: true,
                    title: templateInfo.title,
                    minify:{
                        removeComments: templateInfo.removeComments //是否压缩时 去除注释
                    }
                }),
                new MiniCssExtractPlugin({
                    filename: hashFileName ? 'css/vendor[contenthash].css' : 'css/vendor.css',
                    chunkFilename: hashFileName ? 'css/app[name][contenthash:12].css' : 'css/app[name].css',
                    ignoreOrder: true
                })
            ]
        }
    }
}