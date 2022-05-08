import { utils } from "elmer-common";
import * as fs from "fs";

const files = {
    scan: (path:string) => {
        if(!utils.isEmpty(path) && fs.existsSync(path)) {
            const info = fs.statSync(path);
            return info.isDirectory() ? fs.readdirSync(path) : [];
        } else {
            console.error(`[${path}] Can not found that file or directory`);
            return [];
        }
    },
    mkdir: (path: string): void => {
        fs.mkdirSync(path);
    },
    writeFileSync: (fileName, data: string): void => {
        fs.writeFileSync(fileName, data, "utf8");
    },
    exists: (fileName: string): boolean => {
        return fs.existsSync(fileName);
    },
    isFile: (fileName: string): boolean => {
        try{
            return fs.statSync(fileName).isFile();
        } catch(e) {
            return false;
        }
    },
    isDirectory: (fileName: string): boolean => {
        try {
            return fs.statSync(fileName).isDirectory();
        } catch(e) {
            return false;
        }
    },
    size: (fileName: string): number => {
        if(files.exists(fileName)) {
            const fState = fs.statSync(fileName);
            if(fState.isFile()) {
                return fState.size;
            }
        }
        return 0;
    },
    getDirectorySize: (path: string):number => {
        if(files.exists(path)) {
            if(files.isDirectory(path)) {
                const folders = files.scan(path);
                let size = 0;
                folders.map((tmpFolerName: string) => {
                    size += files.getDirectorySize(path + "/" + tmpFolerName);
                });
                return size;
            } else {
                return files.size(path);
            }
        } else {
            return 0
        }
    },
    delete: (fileName:string): void => {
        if(files.exists(fileName)) {
            fs.unlinkSync(fileName);
        }
    },
    binary: (fileName: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            if(files.exists(fileName)) {
                const fReaderStream = fs.createReadStream(fileName);
                const buffers:Buffer[] = [];
                fReaderStream.on("data", (byteData) => {
                    buffers.push(byteData as Buffer);
                });
                fReaderStream.on("end", () => {
                    resolve(Buffer.concat(buffers));
                });
                fReaderStream.on("error", (err) => {
                    reject(err);
                });
            } else {
                reject({
                    statusCode: "FILE_NOT_FOUND",
                    message: "target file not found"
                });
            }
        });
    },
    formatSize: (size: number): string => {
        if (size < 1024) {
            return size + "Byte";
        } else if(size >= 1024 && size < Math.pow(1024,2)) {
            return (size / 1024).toFixed(2) + "KB";
        } else if(size >= Math.pow(1024,2) && size < Math.pow(1024,3)) {
            return (size / 1024 / 1024).toFixed(2) + "MB";
        } else if(size >= Math.pow(1024,3) && size < Math.pow(1024,4)) {
            return (size / 1024/1024/1024).toFixed(2) + "GB";
        } else if(size >= Math.pow(1024,4)) {
            return (size/1024/1024/1024/1024).toFixed(2) + "TB";
        }
        return "0Byte";
    },
    readJson<T={}>(fileName: string, key?: string): T {
        if(files.exists(fileName)) {
            const txt = fs.readFileSync(fileName, "utf8");
            const data = txt?.length > 0 ? JSON.parse(txt) : null;
            if(data && !utils.isEmpty(key)) {
                return data[key];
            } else {
                return data;
            }
        }
    },
    getName(fileName:string):string {
        const fileNameStr = (fileName||"").replace(/\\/g, "/");
        const lIndex = fileNameStr.lastIndexOf("/");
        return lIndex >= 0 ? fileNameStr.substr(lIndex + 1) : fileNameStr;
    }
};

export default files;
