// 生产环境的插件electron
import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import * as electronBuilder from 'electron-builder'
// 打包代码单独封装
const buildBackground = () => {
  // 将background.ts文件编译成js文件
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('esbuild').buildSync({
    entryPoints: ['src/background.ts'],
    bundle: true,
    outfile: 'dist/background.js',
    platform: 'node',
    target: 'node12',
    external: ['electron']
  })
}
const targets = [
  // { target: 'nsis', arch: ['x64'] } // 为Windows构建64位安装程序
  { target: 'dmg', arch: ['x64'] } // 为macOS构建64位DMG镜像
]
const newbuild: any = electronBuilder.build
// 打包 需要先等vite打完包之后就有index.html文件了， 在执行electron-build打包
export const ElectronBuildPlugin = (): Plugin => {
  return {
    name: 'electron-build',
    closeBundle() {
      // 防止没有运行pnpm run dev 生成dist打包文件，而是直接运行pnpm run build的情况， 直接运行build的话就没有dist/background.js 会报错
      buildBackground()
      console.log('打包了---------', process.argv)
      // 打包前先判断是否有打包输出目录release，如果有则先清空
      const distPath = path.join(process.cwd(), 'release')
      console.log('打包输出目录-----', distPath)

      if (fs.existsSync(distPath)) {
        fs.rmdirSync(distPath, { recursive: true })
      }
      // electron-builder 需要指定package.json main
      // 需要操作package.json文件
      const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
      json.main = 'background.js'
      // 新增代码
      const electronConfig = json.devDependencies.electron.replace('^', '')
      delete json.scripts
      delete json.devDependencies
      json.devDependencies = { electron: electronConfig }
      // 新增代码
      fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 4))
      console.log('打包了json----------------------', json)
      // bug electron-builder 他会给你下载垃圾文件
      fs.mkdirSync('dist/node_modules')
      newbuild({
        config: {
          appId: 'com.exampleYeah.app',
          productName: '桌面开发工具', // 应用名称
          directories: {
            output: path.join(process.cwd(), 'release'), // 输出目录
            app: path.join(process.cwd(), 'dist') // app目录
          },
          win: {
            // icon: 'build/electron-icon/icon.ico',
            icon: 'build/electron-xxt-icon/icon.ico',
            // 图标路径 windows系统中icon需要256*256的ico格式图片，更换应用图标亦在此处
            target: [
              {
                // 打包成一个独立的 exe 安装程序
                target: 'nsis',
                // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大，所以建议直接打32的安装包。
                arch: [
                  // 'x64',
                  'ia32'
                ]
              }
            ]
          },
          dmg: {
            contents: [
              {
                x: 410,
                y: 150,
                type: 'link',
                path: '/Applications'
              },
              {
                x: 130,
                y: 150,
                type: 'file'
              }
            ]
          },
          mac: {
            // icon: 'build/electron-icon/icon.icns'
            icon: 'build/electron-xxt-icon/icon.icns'
          },
          asar: true, // 帮我们打包成一个压缩包
          nsis: {
            oneClick: false, // 取消一键安装
            allowToChangeInstallationDirectory: true, // 允许用户选择安装目录
            // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
            allowElevation: true,
            // 安装图标
            // installerIcon: 'build/electron-icon/icon.ico',
            installerIcon: 'build/electron-xxt-icon/icon.ico',
            // 卸载图标
            // uninstallerIcon: 'build/electron-icon/icon.ico',
            uninstallerIcon: 'build/electron-xxt-icon/icon.ico',
            // 安装时头部图标
            // installerHeaderIcon: 'build/electron-icon/icon.ico',
            installerHeaderIcon: 'build/electron-xxt-icon/icon.ico',
            // 创建桌面图标
            createDesktopShortcut: true,
            // 创建开始菜单图标
            createStartMenuShortcut: true
          }
        }
        // 对windows平台进行打包配置
        // targets
      })
    }
  }
}
