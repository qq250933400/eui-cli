import "colors";
import Base from "./Base";

export enum EnumLogType {
    INFO = "INFO",
    ERROR = "ERROR",
    WARNING = "WARNING",
    SUCCESS = "SUCCESS"
}

export class BaseBuilder extends Base {
    private fs:any;
    // tslint:disable-next-line:variable-name
    constructor(_fs:any) {
        super();
        this.fs = _fs;
        if(!Date.prototype.format) {
            // tslint:disable-next-line: only-arrow-functions
            Date.prototype.format = function(formatStr: string): string {
                const year = this.getFullYear();
                let month = this.getMonth() + 1;
                let date = this.getDate();
                let hour = this.getHours();
                let minutes = this.getMinutes();
                let second = this.getSeconds();
                const milliseconds = this.getMilliseconds();
                month = month > 9 ? month : "0" + month;
                date = date > 9 ? date : "0" + date;
                hour = hour > 9 ? hour : "0" + hour;
                minutes = minutes > 9 ? minutes : "0" + minutes;
                second = second > 9 ? second : "0" + second;
                const result = formatStr.replace(/YYYY/g, year)
                    .replace(/MM/g, month)
                    .replace(/DD/g, date)
                    .replace(/H/ig, hour)
                    .replace(/i/g, minutes)
                    .replace(/ms/g, milliseconds)
                    .replace(/s/g, second)
                    .replace(/yyyy/g, year)
                    .replace(/mm/g, month)
                    .replace(/dd/g, date);
                return result;
            };
        }        
    }
    isFile(fileName: string):boolean {
        let checkFileName = fileName;
        if(!/^[a-z]\:/i.test(fileName)) {
            checkFileName = fileName.replace(/\\/g, "/");
        }
        return this.isExists(checkFileName) ? this.fs.statSync(checkFileName).isFile() : false;
    }
    isExists(fileName:string):boolean {
        return this.fs.existsSync(fileName);
    }
    scanFiles(path:string, fn:Function):void {
        this.fs.readdir(path, (error, files) => {
            if(error) {
                const msg = this.formatLog(error.message, EnumLogType.ERROR);
                // tslint:disable-next-line:no-console
                console.error(msg);
                return;
            }
            let tmpPath = path.replace(/\//g,"\\");
            tmpPath = /\\$/.test(tmpPath) ? tmpPath : tmpPath + "\\";
            for(const tmpData of files) {
                let tmpFileName = tmpPath + tmpData;
                tmpFileName = /^[a-z]\:/i.test(tmpFileName) ? tmpFileName : tmpFileName.replace(/\\/g, "/");
                if(this.isFile(tmpFileName)) {
                    this.isFunction(fn) && fn(tmpFileName, tmpPath);
                } else {
                    this.scanFiles(tmpFileName, fn);
                }
            }
        });
    }
    saveFile(fileName:string, data: any):void {
        const tmpFile = fileName.replace(/\\/g,"/");
        const tIndex = tmpFile.lastIndexOf("/");
        if(!/^\//.test(tmpFile)) {
            // Windows系统
            if(tIndex>0) {
                const tmpPath = tmpFile.substr(0, tIndex);
                const tmpArr = tmpPath.split("/");
                let tmpStrPath = "";
                for(let i = 0;i<tmpArr.length; i++) {
                    tmpStrPath += this.isEmpty(tmpStrPath) ? tmpArr[i] : "/" + tmpArr[i];
                    if(!/^[A-Z]\:$/i.test(tmpStrPath)) {
                        if(!this.isExists(tmpStrPath)) {
                            this.fs.mkdirSync(tmpStrPath);
                            // tslint:disable-next-line:no-console
                            this.log("创建目录：" + tmpStrPath, "INFO");
                        }
                    }
                }
                this.fs.writeFileSync(fileName, data);
            }
        } else {
            // linux系统
            if(tIndex>0) {
                const tmpPath = tmpFile.substr(0, tIndex);
                const tmpArr = tmpPath.split("/");
                let tmpStrPath = "";
                for(let i = 0;i<tmpArr.length; i++) {
                    tmpStrPath += "/" + tmpArr[i];
                    if(!this.isExists(tmpStrPath) && !this.isEmpty(tmpStrPath)) {
                        // tslint:disable-next-line:no-console
                        this.log("创建目录：" + tmpStrPath, "INFO");
                        this.fs.mkdirSync(tmpStrPath);
                    }
                }
            }
            const saveFileName = fileName.replace(/\\/g,"/");
            this.fs.writeFileSync(saveFileName, data);
        }
        this.log("复制文件：" + fileName, "INFO");
        console.log(this.formatLog("复制文件：" + fileName, EnumLogType.INFO));
    }
    formatLog(msg: string, type:EnumLogType): string {
        const now = (new Date()).format("YYYY-MM-DD HH:ii:ss");
        let result = "[" + type.toString() + "]["+now+"]    " + msg;
        switch(type) {
            case EnumLogType.INFO: {
                result = result.green;
                break;
            }
            case EnumLogType.ERROR: {
                result = result.red;
                break;
            }
            case EnumLogType.SUCCESS: {
                result = result.green;
                break;
            }
            case EnumLogType.WARNING: {
                result = result.yellow;
                break;
            }
            default: {
                result = result.magenta;
            }
        }
        return result;
    }
}
