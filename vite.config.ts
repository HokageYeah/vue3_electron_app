import { resolve } from 'node:path'
import type { ConfigEnv, UserConfigExport } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// vite+electron打包和运行插件
import electronRenderer from 'vite-plugin-electron-renderer'

// 按需导入、自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImportTypes from 'auto-import-types'
import PiniaAutoRefs from 'pinia-auto-refs'
import { createProxy } from './dev-build/vite/proxy'
import { wrapperEnv } from './dev-build/utils'
import { ElectronBuildPlugin } from './plugins/vite.electron.build'
import { ElectronDevPlugin } from './plugins/vite.electron.dev'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd()
  // 读取vite环境配置
  const env = loadEnv(mode, root)
  console.log('ConfigEnv----env---', env)
  console.log('ConfigEnv----command---', command)
  // 格式化配置项
  const viteEnv = wrapperEnv(env)
  const { VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_PORT, VITE_GLOB_PROD_MOCK, VITE_PROXY } =
    viteEnv
  console.log('vite----viteEnv----', viteEnv)
  console.log('vite----VITE_DROP_CONSOLE----', VITE_DROP_CONSOLE)
  return defineConfig({
    base: VITE_PUBLIC_PATH, // 默认是绝对路径， 要改成相对路径，不然会白屏
    esbuild: {},
    plugins: [
      vue(),
      vueJsx(),
      ElectronDevPlugin(),
      ElectronBuildPlugin(),
      electronRenderer(),
      AutoImportTypes(),
      AutoImport({
        dts: 'auto-imports.d.ts',
        imports: [
          'vue',
          'pinia',
          {
            '@/helper/pinia-auto-refs': ['useStore']
          }
        ],
        exclude: ['createApp'],
        eslintrc: {
          enabled: true,
          globalsPropValue: true
        },
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        // 没有配置制定的路径，会自动找src/components（这个地方会存放全局公共组件）文件下的拓展名vue的文件进行自动导入
        // 拓展名为vue
        extensions: ['vue'],
        dts: 'components.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      PiniaAutoRefs({
        storeDir: 'src/stores',
        excludes: ['index'],
        outputFile: 'src/helper/pinia-auto-refs.ts'
      })
    ],
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: `${pathResolve('types')}/`
        },
        {
          find: '@',
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    server: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      // base: VITE_PUBLIC_PATH, // 生产环境路径
      host: true,
      port: VITE_PORT, // 端口号
      proxy: createProxy(VITE_PROXY)
    },
    // 发布build的时候删除console
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: VITE_DROP_CONSOLE,
          drop_debugger: VITE_DROP_CONSOLE
        }
      }
      // brotliSize: false,
      // chunkSizeWarningLimit: 2000
    }
  })
}
