//src\main\CustomScheme.ts
// app ready前，通过 protocol 对象的 registerSchemesAsPrivileged 方法为名为 app 的
// scheme 注册了特权（可以使用 FetchAPI、绕过内容安全策略等）。
import { protocol } from 'electron'
import fs from 'fs'
import path from 'path'

//为自定义的app协议提供特权
const schemeConfig = {
  standard: true,
  supportFetchAPI: true,
  bypassCSP: true,
  corsEnabled: true,
  stream: true
}
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: schemeConfig }])

export class CustomScheme {
  //根据文件扩展名获取mime-type
  private static getMimeType(extension: string) {
    let mimeType = ''
    if (extension === '.js') {
      mimeType = 'text/javascript'
    } else if (extension === '.html') {
      mimeType = 'text/html'
    } else if (extension === '.css') {
      mimeType = 'text/css'
    } else if (extension === '.svg') {
      mimeType = 'image/svg+xml'
    } else if (extension === '.json') {
      mimeType = 'application/json'
    }
    return mimeType
  }
  //注册自定义app协议
  static registerScheme() {
    protocol.handle('app', (request) => {
      let pathName = new URL(request.url).pathname
      console.log('registerScheme---pathName---', pathName)

      let extension = path.extname(pathName).toLowerCase()
      console.log('registerScheme---extension---', extension)
      if (extension == '') {
        pathName = 'index.html'
        extension = '.html'
      }
      const tarFile = path.join(__dirname, pathName)
      console.log('registerScheme---tarFile---', extension)
      return new Response(fs.readFileSync(tarFile), {
        headers: {
          'Content-Type': CustomScheme.getMimeType(extension)
        },
        status: 200
      })
    })
  }
}
