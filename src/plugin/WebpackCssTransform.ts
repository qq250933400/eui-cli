import { ConcatSource } from "webpack-sources";
export default class WebpackCssTransform {
    apply(compiler: any): void {
        compiler.hooks.compilation.tap("WebpackCssTransform", (compilation) => {
            compilation.hooks.optimizeChunkAssets.tap('CustomPlugin', (chunks) => {
                chunks.forEach((chunk) => {
                    chunk.files.forEach((fileName: string) => {
                        // 判断具体要修改的文件，假设简单通过 chunk 的文件名称判断入口
                        if (/\.(less|css)$/.test(fileName)) {
                            const pluginVersion = '/*\r\n' +
                            '    author : Elmer S J Mo \r\n' +
                            '    email  : 250933400@qq.com \r\n' +
                            '    version: 1.0.0 \r\n' +
                            '*/\r\n';
                            compilation.assets[fileName] = new ConcatSource(pluginVersion,compilation.assets[fileName]);
                        }
                    });
                });
            });
        });
        compiler.hooks.done.tap("WebpackCssTransform", (compilation) => {
            console.log("++------","done");
        });
    }
}