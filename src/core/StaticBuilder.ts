import { BaseBuilder, EnumLogType } from "./BaseBuilder";
import * as path from "path";

export class StaticBuilder extends BaseBuilder {
    srcPath:string;
    desPath:string;
    io: any;
    constructor(fs:any,srcPath:string, desPath:string) {
        super(fs);
        this.srcPath = path.resolve(process.cwd(),srcPath);
        this.desPath = path.resolve(process.cwd(),desPath);
        this.io = fs;
    }
    setSrcPath(path:string):void {
        this.srcPath = path;
    }
    setDesPath(path:string):void {
        this.desPath = path;
    }
    run():void {
        if(this.isExists(this.srcPath) && this.isExists(this.desPath)) {
            const srcRootPath = this.srcPath.replace(/\\/g,"/").replace(/\/$/,"");
            // tslint:disable-next-line:no-console
            this.log("Source: " + srcRootPath, "INFO");
            // tslint:disable-next-line:no-console
            this.log("Build: " + this.desPath, "INFO");
            this.scanFiles(this.srcPath, (fileName) => {
                if(!/\.(ts|tsx|js|jsx)$/.test(fileName)) {
                    const tmpSrcRootPath = srcRootPath.replace(/\//g,"\\");
                    const tmpFileName = fileName.replace(/\//g,"\\");
                    const desFileName = tmpFileName.replace(tmpSrcRootPath, "");
                    const desPath = this.desPath.replace(/\//g,"\\").replace(/\\$/,"");
                    const desFile = desPath + desFileName;
                    if(!/\.DS_Store$/.test(desFile)) {
                        this.saveFile(desFile, this.io.readFileSync(fileName));
                    }
                }
            });
        } else {
            // tslint:disable-next-line:no-console
            this.log("请检查配置路径是否存在？", "WARN");
        }
    }
}
