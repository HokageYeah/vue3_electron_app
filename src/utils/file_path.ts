const path = require('node:path')
const fs = require('node:fs')
const os = require('os')
import axios from 'axios'
const sudoPrompt = require('sudo-prompt')
const { exec } = require('child_process')
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
        const data = fs.readFileSync(pathfile)
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
      fileReader.onload = async () => {
        const fileContent = fileReader.result // 文件内容
        // 在这里可以处理文件内容，例如将内容写入另一个文件
        try {
          // 示例：将内容写入本地文件
          const savePath = fileStr // 替换为实际保存路径和文件名
          const writer = fs.createWriteStream(savePath)
          writer.write(fileContent, () => {
            writer.end()
            process.nextTick(() => {
              callback(1, '文件内容已保存到本地文件！')
            })
            // setTimeout(() => {
            //   callback(1, '文件内容已保存到本地文件！')
            // }, 100)
          })

          // setTimeout(() => {
          //   callback(1, '文件内容已保存到本地文111件！')
          // }, 100)
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
const changeCurrent = (fileName: string) => {
  return new Promise((res, rej) => {
    fileReadSync().then((fileData: string) => {
      const obj = JSON.parse(fileData)
      obj.current = fileName
      fileWriteSync(obj)
        .then((str: string) => {
          res(str)
        })
        .catch((err) => {
          rej(err)
        })
    })
  })
}
const addOrUpdateHostsEntry = (content: any, hostname: any, ipAddress: any) => {
  const lines = content.split('\n')
  let updatedContent = ''
  let entryUpdated = false
  debugger
  for (const line of lines) {
    if (line.trim().startsWith(ipAddress)) {
      // 如果已存在相同的 IP 地址，则更新主机名
      updatedContent += `${ipAddress} ${hostname}\n`
      entryUpdated = true
    } else {
      updatedContent += `${line}\n`
    }
  }
  debugger
  if (!entryUpdated) {
    // 如果 hosts 文件中不存在相同的 IP 地址，则添加新条目
    updatedContent += `${ipAddress} ${hostname}\n`
  }
  console.log(updatedContent)
}

const readLocalHostsFile = () => {
  return new Promise((res, rej) => {
    const isWindows = process.platform === 'win32'
    let hostsFilePath: string

    if (isWindows) {
      // Windows 上的 hosts 文件路径
      hostsFilePath = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
    } else {
      // macOS 上的 hosts 文件路径
      hostsFilePath = '/etc/hosts'
    }
    // 读取 hosts 文件内容
    fs.readFile(hostsFilePath, 'utf-8', (err: any, data: any) => {
      if (err) {
        console.error('无法读取 hosts 文件:', err)
        rej(`无法读取 hosts 文件:${err}`)
        return
      }
      res({ hostsFilePath, data })
      console.log(data)
    })
  })
}

function convertToEchoCommands(inputContent: string, filePath: string, issecond = false) {
  const lines = inputContent.split('\n')
  const echoCommands = []

  for (const line of lines) {
    if (line.trim() !== '') {
      const echoCommand = issecond
        ? `echo ${line.trim()} > ${filePath}`
        : `echo ${line.trim()} >> ${filePath}`
      echoCommands.push(echoCommand)
    }
  }

  return echoCommands.join('\n')
}

const updateHostsFile = (hostname: string, downloadedContent: any) => {
  readLocalHostsFile()
    .then(({ hostsFilePath, data }: any) => {
      console.log(data)
      // 在 hosts 文件中添加或更新条目
      // 查找分隔符位置
      // 创建分隔符
      const separator = '# -------------- 已下是下载的主机host文件内容 --------------'

      // 查找分隔符位置
      const separatorStart = data.indexOf(separator)
      debugger
      if (separatorStart === -1) {
        // 如果找不到分隔符，则直接将分隔符、下载的主机文件内容以及原始主机文件内容添加到文件末尾
        let newContent = `${data}\n\n\n${separator}\n${downloadedContent}`
        const isWindows = process.platform === 'win32'
        let echoStr = `/bin/bash -c "echo '${newContent}' > '${hostsFilePath}'"`
        if (isWindows) {
          debugger
          newContent = `${separator}\n${downloadedContent}`
          // newContent = `${downloadedContent}`
          newContent = convertToEchoCommands(newContent.toString(), hostsFilePath)
          debugger
          echoStr = `${newContent} >> "${hostsFilePath}"`
        }
        debugger
        console.log(newContent)

        // 使用 sudo-prompt 执行命令，以管理员权限写入 hosts 文件
        sudoPrompt.exec(
          // `/bin/bash -c "echo '${newContent}' > '${hostsFilePath}'"`,
          // `echo ${downloadedContent} >> ${hostsFilePath}`,
          echoStr,
          { name: 'ChangeHostApp' },
          (error: any, stdout: any, stderr: any) => {
            debugger
            if (error) {
              console.error('无法写入 hosts 文件:', error)
              return
            }
            debugger
            console.log('已成功添加下载的主机文件内容到 hosts 文件。')
          }
        )
        // fs.writeFile(hostsFilePath, newContent, 'utf-8', (err: any) => {
        //   if (err) {
        //     console.error('无法写入 hosts 文件:', err)
        //     return
        //   }

        //   console.log('已成功添加下载的主机文件内容到 hosts 文件。')
        // })
      } else {
        // 如果找到分隔符，则替换分隔符下方的主机内容
        const separatorEnd = separatorStart + separator.length
        const originalContent = data.substring(0, separatorEnd).trim()
        let newContent = `${originalContent}\n${downloadedContent}`

        const isWindows = process.platform === 'win32'
        let echoStr = `/bin/bash -c "echo '${newContent}' > '${hostsFilePath}'"`
        if (isWindows) {
          newContent = `\n${downloadedContent}`
          newContent = convertToEchoCommands(newContent.toString(), hostsFilePath, true)
          debugger
          echoStr = `echo ${newContent} > ${hostsFilePath}`
        }
        debugger
        console.log(newContent)
        // 使用 sudo-prompt 执行命令，以管理员权限写入 hosts 文件
        sudoPrompt.exec(
          // `/bin/bash -c "echo '${newContent}' > '${hostsFilePath}'"`,
          echoStr,
          { name: 'ChangeHostApp' },
          (error: any, stdout: any, stderr: any) => {
            debugger
            if (error) {
              console.error('无法写入 hosts 文件:', error)
              return
            }
            debugger
            console.log('已成功添加下载的主机文件内容到 hosts 文件。')
          }
        )
        // fs.writeFile(hostsFilePath, newContent, 'utf-8', (err: any) => {
        //   if (err) {
        //     console.error('无法写入 hosts 文件:', err)
        //     return
        //   }

        //   console.log('已成功替换下载的主机文件内容。')
        // })
      }
    })
    .catch((err) => {
      console.error(err)
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
  downloadFile,
  changeCurrent,
  updateHostsFile,
  readLocalHostsFile
}
export type { dataItemType }
