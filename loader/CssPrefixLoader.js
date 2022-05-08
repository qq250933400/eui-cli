
const guid = () => {
    const S4 = () => {
        // tslint:disable-next-line: no-bitwise
        return (((1 + Math.random())*0x10000) | 0).toString(16).substr(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4());
}

const CssPrefixLoader = function(source, options) {
    const prefixReg = /(^|\n|\\n|\}|\")([a-z0-9\_\>\:\+\-\.\s]{1,})\{/ig;
    const nameMapping = {};
    let prefix = "style_" + guid();
    if(options && options.prefixPath) {
        const rootPath = process.cwd();
        let fileName = this.resourcePath.replace(rootPath, "") || "";
        let fIndex = fileName.lastIndexOf("/");
        fileName = fIndex > 0 ? fileName.substring(0, fIndex) : fileName;
        fileName = fileName.replace(/\//g, "_");
        prefix = fileName;
    }
    const classArr = source.match(prefixReg);
    if(classArr && classArr.length > 0) {
        const classReg = /\.[a-z0-9\_\-]{1,}/ig;
        for(const classStr of classArr) {
            const oldStr = classStr;
            let newStr = classStr;
            let classM = newStr.match(classReg);
            if(classM && classM.length > 0) {
                for(let i=0;i<classM.length;i++) {
                    const cssMV = classM[i];
                    const cssRV = cssMV.replace(/^\./, "." + prefix + "_");
                    const cssRN = cssMV.replace(/^\./, "");
                    newStr = newStr.replace(cssMV, cssRV);
                    nameMapping[cssRN] = cssRV;
                }
            }
            source = source.replace(oldStr, newStr);
        }
    }
    if(!global["cssMapping"]) {
        global["cssMapping"] = {};
    }
    global["cssMapping"][this.resourcePath] = nameMapping;
    // this.callback(null, source, nameMapping);
    return source;
};

module.exports = CssPrefixLoader;
