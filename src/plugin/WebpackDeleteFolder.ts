import "colors";
import * as fs from "fs";
import * as path from "path";

type WebpackDirectoryDeletePluginOptions = {
    remove?: string[];
};

export default class WebpackDirectoryDelete {
    private options: WebpackDirectoryDeletePluginOptions;
    constructor(options: WebpackDirectoryDeletePluginOptions) {
        this.options = options;
    }
    deleteFolder(filePath: string): void {
        if (fs.existsSync(filePath)) {
            const files = fs.readdirSync(filePath)
            files.forEach((file) => {
                const nextFilePath = `${filePath}/${file}`
                const states = fs.statSync(nextFilePath)
                if (states.isDirectory()) {
                    //recurse
                    this.deleteFolder(nextFilePath)
                } else {
                    //delete file
                    fs.unlinkSync(nextFilePath)
                }
            })
            fs.rmdirSync(filePath)
        }
    }
    apply(compiler: any): void {
        compiler.hooks.done.tap("ElmerWebpackPlugin", ({ compilation }) => {
            if (this.options) {
                if (this.options.remove && this.options.remove.length > 0) {
                    const outPutOptions = compilation.outputOptions;
                    const rootPath = outPutOptions.path;
                    this.options.remove.map((removeItem: string) => {
                        try {
                            const removePath: string = path.resolve(rootPath, removeItem);
                            if (fs.existsSync(removePath)) {
                                const fileHandle = fs.openSync(removePath, "r");
                                const fStat = fs.fstatSync(fileHandle);
                                if (fStat.isDirectory()) {
                                    this.deleteFolder(removePath);
                                } else {
                                    fs.unlinkSync(removePath);
                                }
                                fs.closeSync(fileHandle);
                                console.log(`[Info]    The path "${removePath}" has been deleted`.green);
                            } else {
                                console.log(`[Info]    The path to delete does not exists. -> ${removePath}`.yellow);
                            }
                        } catch (e) {
                            console.log(`[ERR]    ${e.message}`.red);
                        }
                    });
                }
            }
        });
    }
}