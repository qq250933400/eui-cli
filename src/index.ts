#!/usr/bin/env node

import CommandHelper from "elmer-common/lib/CommandHelper";
import "colors";
import devServer from "./webpack/server";
import webpackBuild from "./webpack/build";
import Config from "./core/Config";
import { StaticBuilder } from "./core/StaticBuilder";
import * as fs from "fs";

const command = new CommandHelper(process.argv);

command
    .author("Elmer S J Mo")
    .option("-v", "Version", () => {
        return command.getVersion();
    })
    .command("version", "The cli version", () => {
        console.log(`version: ${command.getVersion()}`.green);
    })
    .command("start", "Webpack server", () => {
        devServer();
    })
    .command("build", "Build package", () => {
        webpackBuild();
    })
    .command("static", "Copy assets files", () => {
        const config = new Config();
        const configData = config.staticBuilderConfig();
        const builder = new StaticBuilder(fs, configData.srcPath, configData.desPath);
        builder.run();
    })
    .init((opt): any => {
        const initResult = {
            commands: []
        };
        if(opt["-v"]) {
            initResult.commands.push("version");
        }
        return initResult;
    })
    .run();