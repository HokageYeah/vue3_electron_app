// 生产环境的插件electron
import type { Plugin } from "vite";
import fs from 'node:fs'
import * as electronBuilder from 'electron-builder'
import path from "node:path";
// 打包代码单独封装
const buildBackground = () => {
    // 将background.ts文件编译成js文件
    require('esbuild').buildSync({
        entryPoints: ['src/background.ts'],
        bundle: true,
        outfile: 'dist/background.js',
        platform: 'node',
        target: 'node12',
        external: ['electron']
    })
}

// 打包 需要先等vite打完包之后就有index.html文件了， 在执行electron-build打包
export const ElectronBuildPlugin = (): Plugin => {
    return {
        name: 'electron-build',
        closeBundle() {
            // 防止没有运行pnpm run dev 生成dist打包文件，而是直接运行pnpm run build的情况， 直接运行build的话就没有dist/background.js 会报错
            buildBackground()

            // electron-builder 需要指定package.json main
            // 需要操作package.json文件
            const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
            json.main = 'background.js'
            fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 4))
            console.log('打包了json----------------------', json);
            // bug electron-builder 他会给你下载垃圾文件
            fs.mkdirSync('dist/node_modules')
            electronBuilder.build({
                config: {
                    appId: 'com.exampleYeah.app',
                    productName: 'vite-electron-yeah',
                    directories: {
                        output: path.join(process.cwd(), "release"), //输出目录
                        app: path.join(process.cwd(), "dist"), //app目录
                    },
                    asar: true, // 帮我们打包成一个压缩包
                    nsis: {
                        oneClick: false, //取消一键安装
                        allowToChangeInstallationDirectory: true, //允许用户选择安装目录
                    }
                }
            })
        },
    }
}