import fs from 'node:fs'
import path from 'node:path'
import { ipcRenderer } from 'electron'

// 以流的形式通知外部
export function microAppBuild(
  macroAppPath: string,
  macroName: string,
  microAppPath: string,
  microName: string,
  events: any
) {
  return new Promise((resolve, reject) => {
    const leftValue = macroName
    const rightValue = microName
    const mainProjectPath = macroAppPath
    const subProjectPath = microAppPath

    // 判断主工程中是否包含uni_modules
    const targetUniModulesPath = path.resolve(mainProjectPath, 'src/uni_modules')
    // 判断子工程中是否包含uni_modules
    const targetSubUniModulesPath = path.resolve(subProjectPath, 'src/uni_modules')
    if (!fs.existsSync(targetUniModulesPath)) {
      reject(new Error(`主应用${leftValue}不存在目标路径：${targetUniModulesPath}`))
    } else if (!fs.existsSync(targetSubUniModulesPath)) {
      reject(new Error(`子应用${rightValue}不存在目标路径：${targetSubUniModulesPath}`))
    } else {
      // 主工程的目标路径
      const targetPath = path.resolve(mainProjectPath, 'src/uni_modules', rightValue)
      ipcRenderer.send('eventLog', targetPath)
      events.emit('eventLogyuye', targetPath)
      // 先删除目标路径上的所有文件在创建
      // fs.rmSync(targetPath, { recursive: true, force: true })
      // 如果目标路径不存在则创建他
      if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true })

      // 子工程的需要拷贝文件的路径
      const srcPath = path.resolve(subProjectPath, 'src')
      copyFolder(srcPath, targetPath, rightValue)

      // 获取pages.json中的文件去赋值
      const pagesJsonPath = path.resolve(subProjectPath, 'src/pages.json')
      // 读取子工程的pages.json
      const pagesJsonStr = fs.readFileSync(pagesJsonPath, 'utf-8')
      // 消除注释
      let pagesJson: any = pagesJsonStr.replace(/(\/\/\s*#.*?\n)/g, '')
      pagesJson = JSON.parse(pagesJson)
      // 小程序过滤路径
      const wxmpFilterPath = `uni_modules/${rightValue}/`
      // 过滤掉包含wxmpFilterPath
      ipcRenderer.send('eventLog', `pagesJson:--${pagesJson.pages}`)
      ipcRenderer.send('eventLog', `wxmpFilterPath:--${wxmpFilterPath}`)
      pagesJson.pages = pagesJson.pages.filter((item: any) => !item.path.includes(wxmpFilterPath))
      const subPagesPathAry = pagesJson.pages.map((item: any) => item.path)
      // wxmpConfig 配置地址
      const wxpmConfigPath = path.join(
        mainProjectPath,
        `./src/wxmp-global-config/subpack-route-map/${rightValue}.json`
      )
      // 在wxpmConfigPath 这个目录下 生成一个以rightValue 为名字的json文件，先判断是否存在
      // 不存在则创建、存在则覆盖
      fs.writeFileSync(wxpmConfigPath, JSON.stringify(subPagesPathAry, null, 2))
      // if (!fs.existsSync(wxpmConfigPath)) {
      //     // 不存在则创建、存在则删除
      //     fs.writeFileSync(wxpmConfigPath, JSON.stringify(subPagesPathAry, null, 2));
      // }
      ipcRenderer.send('eventLog', `subPagesPathAry:--${subPagesPathAry}`)
      const subPackagesRoot = {
        root: `uni_modules/${rightValue}`,
        pages: pagesJson.pages
      }
      // 获取主工程的pages.json文件
      const mainPagesJsonPath = path.resolve(mainProjectPath, 'src/pages.json')
      const mainPagesJson = JSON.parse(fs.readFileSync(mainPagesJsonPath, 'utf-8'))
      if (mainPagesJson.subPackages) {
        // 判断root 中是否存在 如果存在则覆盖
        const index = mainPagesJson.subPackages.findIndex(
          (item: any) => item.root === subPackagesRoot.root
        )
        if (index > -1) {
          mainPagesJson.subPackages[index].pages = pagesJson.pages
        } else {
          mainPagesJson.subPackages = [...mainPagesJson.subPackages, subPackagesRoot]
        }
      } else {
        mainPagesJson.subPackages = [subPackagesRoot]
      }
      ipcRenderer.send('eventLog', `mainPagesJson:--${mainPagesJson}`)
      // 写会到主工程的pages.json中
      fs.writeFileSync(mainPagesJsonPath, JSON.stringify(mainPagesJson, null, 2))
      // 删除除了pages文件夹下的所有文件
      deleteNonPagesFiles(targetPath)
      setTimeout(() => {
        resolve(true)
      }, 1000)
    }
  })
}
// 递归复制文件夹的函数
function copyFolder(source: string, destination: string, rightValue: string) {
  // 读取源文件夹中的所有内容
  try {
    const files = fs.readdirSync(source, { withFileTypes: true })
    // 遍历源文件夹中的每个文件/文件夹
    files.forEach((element) => {
      // console.log('element:', element.name);
      const sourceFilePath = path.join(source, element.name) // 源文件/文件夹路径
      const destinationFilePath = path.join(destination, element.name) // 目标文件/文件夹路径
      // 判断当前是文件夹还是文件
      const isDirectory = fs.statSync(sourceFilePath).isDirectory()
      // 只复制pages文件夹下的所有文件，如果不是pages文件夹下的文件则跳过不复置

      if (isDirectory) {
        // console.log('是文件', sourceFilePath)
        // 创建目标文件夹
        if (!fs.existsSync(destinationFilePath))
          fs.mkdirSync(destinationFilePath, { recursive: true })
        // 递归调用，拷贝文件夹
        copyFolder(sourceFilePath, destinationFilePath, rightValue)
      } else {
        // 拷贝文件到指定路径
        fs.copyFileSync(sourceFilePath, destinationFilePath)
        // 判断destinationFilePath文件是不是包含config/index.ts
        if (destinationFilePath.includes('config/index.ts')) {
          // 如果是则替换成config/index.ts
          let content = fs.readFileSync(destinationFilePath, 'utf-8')
          // 将content中的内容export const PUSH_URL = ''; 替换成export const PUSH_URL = 'uni_modules/${rightValue}';
          content = content.replace(
            "export const PUSH_URL = ''",
            `export const PUSH_URL = \'uni_modules/${rightValue}/\'`
          )
          // console.log('config-content12223:', typeof content, content)
          fs.writeFileSync(destinationFilePath, content)
        }
      }
    })
  } catch (error) {
    if (error) {
      console.error('文件夹读取错误:', error)
    }
  }
}

function deleteNonPagesFiles(directory: string) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)
    // console.log('deleteNonPagesFiles--', filePath, stats.isFile());

    if (stats.isFile() && !filePath.includes('/pages/')) {
      // 如果是文件且不在 pages 文件夹下，则删除
      fs.unlinkSync(filePath)
      ipcRenderer.send('eventLog', `stats.isFile Deleted::--${filePath}`)
    } else if (stats.isDirectory() && file !== 'pages') {
      // 如果是文件夹，则递归删除其下的文件
      fs.rmSync(filePath, { recursive: true, force: true })
      ipcRenderer.send('eventLog', `stats.isDirectory Deleted:--${filePath}`)
    }
  })
}
// function build(macroAppPath: string, microAppPath: string) {
//   const args = process.argv.slice(2)
//   const addIndex = args.indexOf('add')

//   // 当前运行的路径
//   const __filename = fileURLToPath(import.meta.url)
//   const dirname = path.dirname(__filename)
//   let leftValue = ''
//   let rightValue = ''

//   if (addIndex === -1 || !args[addIndex - 1] || !args[addIndex + 1]) {
//     console.error('Error: Missing values around "add" parameter')
//   } else {
//     leftValue = args[addIndex - 1]
//     rightValue = args[addIndex + 1]

//     console.log('主工程:', leftValue)
//     console.log('子工程:', rightValue)
//     console.log('路径dirname:', dirname)
//     console.log('路径__filename:', __filename)
//     // 获取主工程的路径
//     const mainProjectPath = path.resolve(dirname, '../mainProject', leftValue)
//     const subProjectPath = path.resolve(dirname, '../subProject', rightValue)
//     console.log('mainProjectPath:', mainProjectPath)
//     console.log('subProjectPath:', subProjectPath)

//     // 主工程的目标路径
//     const targetPath = path.resolve(mainProjectPath, 'src/uni_modules', rightValue)
//     console.log('targetPath:', targetPath)
//     // 先删除目标路径上的所有文件在创建
//     // fs.rmSync(targetPath, { recursive: true, force: true })
//     // 如果目标路径不存在则创建他
//     if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true })

//     // 子工程的需要拷贝文件的路径
//     const srcPath = path.resolve(subProjectPath, 'src')
//     copyFolder(srcPath, targetPath)

//     // 获取pages.json中的文件去赋值
//     const pagesJsonPath = path.resolve(subProjectPath, 'src/pages.json')
//     // 读取子工程的pages.json
//     const pagesJsonStr = fs.readFileSync(pagesJsonPath, 'utf-8')
//     // 消除注释
//     let pagesJson: any = pagesJsonStr.replace(/(\/\/\s*#.*?\n)/g, '')
//     pagesJson = JSON.parse(pagesJson)
//     // 小程序过滤路径
//     const wxmpFilterPath = `uni_modules/${rightValue}/`
//     // 过滤掉包含wxmpFilterPath
//     console.log('pagesJson:--', pagesJson.pages)
//     console.log('wxmpFilterPath:', wxmpFilterPath)
//     pagesJson.pages = pagesJson.pages.filter((item: any) => !item.path.includes(wxmpFilterPath))
//     console.log('pagesJson:', pagesJson.pages)
//     const subPagesPathAry = pagesJson.pages.map((item: any) => item.path)
//     // wxmpConfig 配置地址
//     const wxpmConfigPath = path.join(
//       mainProjectPath,
//       `./src/wxmp-global-config/subpack-route-map/${rightValue}.json`
//     )
//     // 在wxpmConfigPath 这个目录下 生成一个以rightValue 为名字的json文件，先判断是否存在
//     // 不存在则创建、存在则覆盖
//     fs.writeFileSync(wxpmConfigPath, JSON.stringify(subPagesPathAry, null, 2))
//     // if (!fs.existsSync(wxpmConfigPath)) {
//     //     // 不存在则创建、存在则删除
//     //     fs.writeFileSync(wxpmConfigPath, JSON.stringify(subPagesPathAry, null, 2));
//     // }
//     console.log('subPagesPathAry-----', subPagesPathAry)
//     const subPackagesRoot = {
//       root: `uni_modules/${rightValue}`,
//       pages: pagesJson.pages
//     }
//     // 获取主工程的pages.json文件
//     const mainPagesJsonPath = path.resolve(mainProjectPath, 'src/pages.json')
//     const mainPagesJson = JSON.parse(fs.readFileSync(mainPagesJsonPath, 'utf-8'))
//     if (mainPagesJson.subPackages) {
//       // 判断root 中是否存在 如果存在则覆盖
//       const index = mainPagesJson.subPackages.findIndex(
//         (item: any) => item.root === subPackagesRoot.root
//       )
//       if (index > -1) {
//         mainPagesJson.subPackages[index].pages = pagesJson.pages
//       } else {
//         mainPagesJson.subPackages = [...mainPagesJson.subPackages, subPackagesRoot]
//       }
//     } else {
//       mainPagesJson.subPackages = [subPackagesRoot]
//     }
//     console.log('mainPagesJson:', mainPagesJson)
//     // 写会到主工程的pages.json中
//     fs.writeFileSync(mainPagesJsonPath, JSON.stringify(mainPagesJson, null, 2))
//     // 删除除了pages文件夹下的所有文件
//     deleteNonPagesFiles(targetPath)
//   }
//   // 递归复制文件夹的函数
//   function copyFolder(source: string, destination: string) {
//     // 读取源文件夹中的所有内容
//     try {
//       const files = fs.readdirSync(source, { withFileTypes: true })
//       // 遍历源文件夹中的每个文件/文件夹
//       files.forEach((element) => {
//         // console.log('element:', element.name);
//         const sourceFilePath = path.join(source, element.name) // 源文件/文件夹路径
//         const destinationFilePath = path.join(destination, element.name) // 目标文件/文件夹路径
//         // console.log('sourceFilePath:', sourceFilePath);
//         // console.log('destinationFilePath:', destinationFilePath);
//         // 判断当前是文件夹还是文件
//         const isDirectory = fs.statSync(sourceFilePath).isDirectory()
//         // 只复制pages文件夹下的所有文件，如果不是pages文件夹下的文件则跳过不复置

//         if (isDirectory) {
//           console.log('是文件', sourceFilePath)
//           // 创建目标文件夹
//           if (!fs.existsSync(destinationFilePath))
//             fs.mkdirSync(destinationFilePath, { recursive: true })
//           // 递归调用，拷贝文件夹
//           copyFolder(sourceFilePath, destinationFilePath)
//         } else {
//           // 拷贝文件到指定路径
//           fs.copyFileSync(sourceFilePath, destinationFilePath)
//           // 判断destinationFilePath文件是不是包含config/index.ts
//           if (destinationFilePath.includes('config/index.ts')) {
//             // 如果是则替换成config/index.ts
//             let content = fs.readFileSync(destinationFilePath, 'utf-8')
//             // 将content中的内容export const PUSH_URL = ''; 替换成export const PUSH_URL = 'uni_modules/${rightValue}';
//             content = content.replace(
//               "export const PUSH_URL = ''",
//               `export const PUSH_URL = \'uni_modules/${rightValue}/\'`
//             )

//             console.log('config-content12223:', typeof content, content)
//             fs.writeFileSync(destinationFilePath, content)
//           }
//         }
//       })
//     } catch (error) {
//       if (error) {
//         console.error('文件夹读取错误:', error)
//       }
//     }
//   }

//   function deleteNonPagesFiles(directory: string) {
//     fs.readdirSync(directory).forEach((file) => {
//       const filePath = path.join(directory, file)
//       const stats = fs.statSync(filePath)
//       // console.log('deleteNonPagesFiles--', filePath, stats.isFile());

//       if (stats.isFile() && !filePath.includes('/pages/')) {
//         // 如果是文件且不在 pages 文件夹下，则删除
//         fs.unlinkSync(filePath)
//         console.log(`stats.isFile Deleted: ${filePath}`)
//       } else if (stats.isDirectory() && file !== 'pages') {
//         // 如果是文件夹，则递归删除其下的文件
//         fs.rmSync(filePath, { recursive: true, force: true })
//         console.log(`stats.isDirectory Deleted: ${filePath}`)
//       }
//     })
//   }
// }
