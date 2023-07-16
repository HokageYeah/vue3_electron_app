// electron主进程文件
import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true, // 启用Node.js集成（可以在渲染进程中使用node的api 为了安全，默认关闭false）
            contextIsolation: false, // 禁用上下文隔离（关闭渲染进程的沙箱）
            webSecurity: false, // 禁用web安全策略（关闭跨域检查）
        }
    })
    win.webContents.openDevTools()
    console.log('process.argv-----', process.argv);
    if (process.argv[2]) {
        // 开发环境
        win.loadURL(process.argv[2])
    } else {
        // 生产打包环境
        win.loadFile('index.html')
    }
})