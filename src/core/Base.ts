import { Common } from "elmer-common";

type TypeLogType = "ERROR" | "INFO" | "WARN" | "SUCCESS";

export default class Base extends Common {
    log(msg: any, type: TypeLogType = "INFO"): void {
        const now = new Date();
        const dateStr = [this.formatLen(now.getFullYear(), 4), this.formatLen(now.getMonth(), 2), this.formatLen(now.getDate(),2)].join("-");
        const timeStr = [this.formatLen(now.getHours(), 2), this.formatLen(now.getMinutes(), 2), this.formatLen(now.getSeconds(),2)].join(":");
        const dateTimeStr = dateStr + " " + timeStr;
        const msgResult = `[${type}][${dateTimeStr}] ${msg}`;
        if(type === "INFO") {
            console.log(msgResult.white);
        } else if(type === "ERROR") {
            console.log(msgResult.red);
        } else if(type === "WARN") {
            console.log(msgResult.yellow);
        } else if(type === "SUCCESS") {
            console.log(msgResult.green);
        } else {
            console.log(msgResult);
        }
    }
    formatLen(num: number, numLen: number = 0): string {
        const numStr = num.toString();
         if(numStr.length >= numLen) {
             return numStr;
         } else {
             return "0".repeat(numLen - numStr.length) + numStr;
         }
    }
}
