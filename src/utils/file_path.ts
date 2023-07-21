const path = require('node:path')
const fs = require('node:fs')

const userDirectory = process.env.HOME || process.env.USERPROFILE // 获取用户盘的路径
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

export { userDirectory, filePath, filePathAddress, fileReadSync, fileWriteSync }
