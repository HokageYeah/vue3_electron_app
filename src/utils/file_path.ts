const path = require('node:path')
const fs = require('node:fs')
const os = require('os')
import axios from 'axios'

/** 
process.env.HOME是 Linux 和 macOS 系统中用于表示用户主目录的环境变量，而在 Windows 上应使用 process.env.USERPROFILE 来获取用户主目录路径。
然而，尽管process.env.USERPROFILE是正确的变量，但在使用 Electron 框架打包后，默认情况下不再具有这样的环境变量。因此，你需要使用其他方法来获取用户主目录路径。
你可以尝试使用 Node.js 的 os 模块来获取用户主目录路径，
*/
const userDirectory = process.env.HOME || process.env.USERPROFILE || os.homedir() // 获取用户盘的路径
console.log('userDirectory-------', userDirectory)

const filePath = path.join(userDirectory!, 'chh')
const filePathAddress = path.join(filePath, 'hostAddress.json')
const filePathHosts = path.join(filePath, 'hosts')

const fileReadSync = async (pathfile = filePathAddress) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<string>(async (resolve, reject) => {
    debugger
    if (fs.existsSync(pathfile)) {
      // const data = await fs.promises.readFile(pathfile);
      // console.log('的哈是多久撒朗读记录上----', data);
      try {
        // 同步读取文件
        const data = fs.readFileSync(pathfile);
        console.log('读取到的数据:', data);
        resolve(data)
        // 在这里处理读取到的数据
      } catch (err) {
        // 如果读取出错则抛出错误。
        reject()
      }
    } else {
      reject()
    }
  })
}

const fileWriteSync = (data: any, pathfile = filePathAddress) => {
  return new Promise<string>((res, rej) => {
    try {
      fs.writeFileSync(pathfile, JSON.stringify(data, null, 4))
      res('设置成功')
    } catch (error) {
      rej(error)
    }
  })
}

const isFileExists = (fileName: string) => {
  const fileStr = path.join(filePathHosts, `${fileName}.txt`)
  return fs.existsSync(fileStr) && fs.statSync(fileStr).isFile()
}

const downloadFile = async (url: string, pathName: string, callback: Function) => {
  // const response = await axios({
  //   url: url,
  //   method: 'GET',
  //   responseType: 'arraybuffer'
  // });
  // let downloadedBytes = 0;
  // debugger
  // response.data.on('data', (chunk: string | any[]) => {
  //   downloadedBytes += chunk.length;
  //   const progress = Math.round((downloadedBytes / 1024) * 100) / 100; // 计算下载进度（假设文件以 KB 为单位）
  //   debugger
  //   console.log(`当前下载进度：${progress} KB`);
  //   // 更新进度条或执行其他操作
  // });

  debugger
  return axios({
    url: url,
    method: 'GET',
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
      console.log('progress------', progress)
    }
  })
    .then((response) => {
      debugger
      const blob = new Blob([response.data])
      const fileStr = path.join(filePathHosts, `${pathName}.txt`)
      debugger
      // 将数据写入本地文件
      const fileReader = new FileReader()
      fileReader.onload = () => {
        const fileContent = fileReader.result // 文件内容
        // 在这里可以处理文件内容，例如将内容写入另一个文件
        try {
          // 示例：将内容写入本地文件
          const savePath = fileStr // 替换为实际保存路径和文件名
          const writer = fs.createWriteStream(savePath)
          writer.write(fileContent)
          writer.end()
          callback(1, '文件内容已保存到本地文件！')
        } catch (error) {
          callback(0, '文件下载保存失败！')
          throw error // 抛出错误
        }
      }
      fileReader.readAsText(blob)
    })
    .catch((error) => {
      console.error('下载文件时发生错误:', error)
      callback(0, '文件下载保存失败！')
      throw error // 抛出错误
    })
}

type dataItemType = {
  name: string
  url: string
  isActive?: boolean
}

export {
  userDirectory,
  filePath,
  filePathAddress,
  filePathHosts,
  fileReadSync,
  fileWriteSync,
  isFileExists,
  downloadFile
}
export type { dataItemType }
