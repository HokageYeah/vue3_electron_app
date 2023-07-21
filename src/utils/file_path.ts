const path = require('node:path')
const fs = require('node:fs')
const os = require('os')

/** 
process.env.HOME是 Linux 和 macOS 系统中用于表示用户主目录的环境变量，而在 Windows 上应使用 process.env.USERPROFILE 来获取用户主目录路径。
然而，尽管process.env.USERPROFILE是正确的变量，但在使用 Electron 框架打包后，默认情况下不再具有这样的环境变量。因此，你需要使用其他方法来获取用户主目录路径。
你可以尝试使用 Node.js 的 os 模块来获取用户主目录路径，
*/
const userDirectory = process.env.HOME || process.env.USERPROFILE || os.homedir() // 获取用户盘的路径
console.log('userDirectory-------', userDirectory)

const filePath = path.join(userDirectory!, 'chh')
const filePathAddress = path.join(filePath, 'hostAddress.json')
debugger
const fileReadSync = () => {
  return new Promise<string>((resolve, reject) => {
    if (fs.existsSync(filePathAddress)) {
      fs.readFile(filePathAddress, 'utf8', (err: any, data: string) => {
        if (err) {
          // 如果读取出错则抛出错误。
          reject()
        } else {
          console.log('文件内容：', data)
          resolve(data)
        }
      })
    } else {
      reject()
    }
  })
}

const fileWriteSync = (data: any) => {
  return new Promise<string>((res, rej) => {
    try {
      fs.writeFileSync(filePathAddress, JSON.stringify(data, null, 4))
      res('设置成功')
    } catch (error) {
      rej(error)
    }
  })
}

type dataItemType = {
  name: string
  url: string
}

export { userDirectory, filePath, filePathAddress, fileReadSync, fileWriteSync }
export type { dataItemType }
