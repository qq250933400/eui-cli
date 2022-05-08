#!/usr/bin/env node

import CommandHelper from "elmer-common/lib/CommandHelper";
import "colors";
import devServer from "./webpack/server";
import webpackBuild from "./webpack/build";

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