# vue3+electron+app项目
## 项目运行
1. 克隆项目后，先下载项目依赖，执行命令 `npm install`。建议 node 版本 18+

## vite插件说明
* "unplugin-auto-import": 是一个为 Vite、Webpack、Rollup 和 esbuild 按需自动导入 API，支持 TypeScript的插件，我们基于此插件实现自动按需导入。作用：
    * 1、 自动导入模块： 可以自动导入 JavaScript 库中的模块，减少手动导入的工作量。
    * 2、类型支持： 支持类型定义，可以提供良好的 IDE 支持和类型检查。
    * 3、按需加载和优化： 支持按需加载模块，以及其他一些优化功能，如缓存和请求合并，以提升性能和加载速度。
    * 4、灵活配置： 允许开发者根据项目需要进行配置，以适应不同的开发场景和需求。

* "unplugin-vue-components"：主要用于帮助自动化处理和导入 Vue 组件，以简化 Vue 项目中组件的管理和使用。具体功能包括：
    * 1、 自动导入组件： 可以自动从指定目录中导入 Vue 组件，无需手动一个个引入。
    * 2、 按需加载组件： 支持根据需要按需加载 Vue 组件，以减小项目的打包体积。
    * 3、组件路径解析： 解析组件的路径，使得在模板或代码中引入组件时更加简洁和方便。
    * 4、性能优化： 通过以上功能，可以提升项目的开发效率和构建性能，特别是在大型项目中管理和使用大量 Vue 组件时尤为有用。

* "vite-plugin-electron-renderer":是一个 Vite 插件，专门用于简化 Electron 应用程序中渲染进程的开发和构建过程。。作用：
    * 1、支持 Vite 的开发体验： 让开发者能够利用 Vite 提供的快速开发服务器和即时热更新功能来加速 Electron 渲染进程的开发过程。
    * 2、内置 TypeScript 支持： 支持在 Electron 渲染进程中直接使用 TypeScript 编写代码，无需额外配置。
    * 3、快速热重载（HMR）： 基于 Vite 的模块热替换技术，使得在开发过程中修改代码后可以快速在 Electron 应用中看到变更，提高开发效率。。
    * 4、优化构建速度： Vite 的构建器能够实现快速的开发构建，与 Electron 的需求相符，同时支持按需加载，可以显著提升应用的加载速度和性能。
    * 5、集成 Electron 特定功能： 提供一些特定于 Electron 渲染进程的功能支持，如 Electron API 的自动注入，使得在开发过程中可以方便地调用 Electron 提供的原生 API。
    * 6、灵活的配置选项： 允许开发者根据项目的具体需求进行配置，包括自定义构建输出目录、配置开发服务器选项以及其他 Vite 和 Electron 的相关配置。

* "pinia-auto-refs": 这个库是Pinia的一个插件，用于自动创建和引用store实例的全局变量。通常情况下，你需要在Vue组件中手动导入和使用store实例，而"pinia-auto-refs"可以简化这个过程。它会自动将store实例绑定到Vue实例的$store属性上，从而使你可以在组件中直接访问和使用store实例，而无需手动导入。
    - [pinia-auto-refs](https://github.com/Allen-1998/pinia-auto-refs)

## eslint+prettier问题解决
* [Delete `␍`eslint(prettier/prettier)](https://blog.csdn.net/weixin_60941411/article/details/135538432)
