// 开发环境的插件electron
import type { AddressInfo } from "net";
import type { Plugin } from "vite";
import { spawn } from 'node:child_process'
import fs from "node:fs";

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

// vite  插件要求必须要导出一个对象，对象必须有name属性
export const ElectronDevPlugin = (): Plugin => {
    return {
        name: 'electron-dev',
        configureServer(server) {
            // 将background.ts文件编译成js文件
            buildBackground()
            server.httpServer?.once('listening', () => {
                // 读取vite服务的信息
                const addressInfo = server.httpServer?.address() as AddressInfo
                // 拼接给electron启动服务的时候要用的ip地址
                const IP = `http://localhost:${addressInfo.port}`
                console.log('哈哈哈---------', IP);
                // 第一个参数是electron的入口文件
                // require('electron')返回是一个路径
                // electron 是不认识ts文件，需要先进行编译成js文件
                // 进程传参法，发送给electron IP地址
                const electronStr = require('electron') as unknown as String
                console.log('electron的入口文件---------', electronStr);
                let electronProcess = spawn(<string>electronStr, ['dist/background.js', IP])

                // 监听src下面的background.ts文件，只要改变就先杀死进程在重新启动electron，实现热更新
                fs.watchFile('src/background.ts', () => {
                    // 先杀死electron进程
                    electronProcess.kill()
                    // 将background.ts文件编译成js文件
                    buildBackground()
                    electronProcess = spawn(<string>electronStr, ['dist/background.js', IP])
                })
                // 监听electron进程输出的日志
                electronProcess.stderr.on('data', (data) => {
                    console.log('data日志输出-----', data);
                })
            })
        }
    }
}