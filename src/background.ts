// electron主进程文件
import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
app.whenReady().then(() => {
  const win = new BrowserWindow({
    height: 750,
    width: 1180,
    minHeight: 580,
    minWidth: 880,
    titleBarStyle: 'default',
    // frame: false, // 隐藏默认边框
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true, // 启用Node.js集成（可以在渲染进程中使用node的api 为了安全，默认关闭false）
      contextIsolation: false, // 禁用上下文隔离（关闭渲染进程的沙箱）
      webSecurity: false // 禁用web安全策略（关闭跨域检查）
    }
  })
  win.webContents.openDevTools()
  // if (process.platform === 'darwin') {
  //   app.dock.setIcon(path.join(__dirname, './dist/favicon.ico'))
  // }
  debugger
  console.log('process.argv', process.argv)
  if (process.argv[2]) {
    // 开发环境
    win.loadURL(process.argv[2])
  } else {
    // 生产打包环境
    win.loadFile('index.html')
  }
})

// 读取或创建文件
const readOrCreateFile = (filePath: any) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath)
    }
    const filePathAddress = path.join(filePath, 'hostAddress.json')
    const fileContent = {
      url: {
        test: '',
        staging: '',
        prod: '',
        'old-bak': '',
        dev: ''
      },
      current: ''
    }
    fs.readFile(filePathAddress, 'utf8', (err, data) => {
      if (err) {
        // 如果文件不存在，则创建文件
        if (err.code === 'ENOENT') {
          fs.writeFile(filePathAddress, JSON.stringify(fileContent), 'utf8', (err: any) => {
            if (err) {
              console.error('创建文件出错3：', err)
              reject(err)
            } else {
              console.log('文件已创建')
              resolve({})
            }
          })
        } else {
          console.error('读取文件出错：', err)
          reject(err)
        }
      } else {
        console.log('文件内容：', data)
        resolve(JSON.parse(data))
      }
    })
  })
}
const checkAndCreateHostsFolder = (hostsFolderPath: string) => {
  try {
    // 判断文件夹是否存在
    const stats = fs.statSync(hostsFolderPath)
    if (stats.isDirectory()) {
      console.log('Hosts文件夹已存在')
    }
  } catch (err) {
    // 文件夹不存在，创建文件夹
    fs.mkdirSync(hostsFolderPath)
    console.log('Hosts文件夹已创建')
  }
}
// 使用示例
const userDirectory = process.env.HOME || process.env.USERPROFILE // 获取用户盘的路径
const filePath = path.join(userDirectory!, 'chh')

app.on('ready', async () => {
  //   const filePath = path.join(__dirname, 'hostAddress.json') // 文件路径，__dirname 表示当前文件所在目录
  debugger
  console.log('filePath-----', filePath)

  try {
    readOrCreateFile(filePath)
      .then((fileData) => {
        // 在这里处理文件内容
        console.log('文件读取或创建成功！', fileData)
        checkAndCreateHostsFolder(path.join(filePath, 'hosts'))
      })
      .catch((err) => {
        console.error('读取或创建文件时出错：', err)
      })
  } catch (error) {
    console.error('出错了：', error)
  }
})
