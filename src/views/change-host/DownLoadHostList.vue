<template>
  <el-container class="layout-container-demo" style="height: 500px">
    <el-aside style="background-color: #e8eaed; border-right: 1px solid #c7cbd0" width="100px">
      <el-scrollbar>
        <el-space direction="vertical" style="width: 100%">
          <el-button
            style="width: 100%"
            :class="['button-click', { active: title == button.name }]"
            v-for="button in tableData"
            :key="button.name"
            size="large"
            :type="buttonType(button.name)"
            link
            @click="btnClick(button.name)"
            @dblclick="doubleC(button.name)"
            >{{ button.name }}</el-button
          >
        </el-space>
      </el-scrollbar>
    </el-aside>
    <el-container style="background-color: #fffffe">
      <el-header class="header">
        <div class="toolbar">
          <span>{{ title }}</span>
          <el-button
            :icon="Download"
            circle
            link
            @click="handleChange"
            v-loading.fullscreen.lock="fullscreenLoading"
          >
          </el-button>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar>
          <code v-show="isNoEmpty" class="code-container">{{ codeContent }}</code>
          <el-empty v-show="!isNoEmpty" :image-size="200" :description="`暂无${title}请下载！`" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {
  fileReadSync,
  isFileExists,
  downloadFile,
  filePathHosts,
  changeCurrent,
  updateHostsFile,
  type dataItemType
} from '@/utils/file_path'
import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
defineOptions({ name: 'DownLoadHostList' })
let jsonObj: any = {}
const tableData: Ref<dataItemType[]> = ref([])
const title = ref('test')
const isNoEmpty = ref(true)
let time: any = null
const fullscreenLoading = ref(false)
const router = useRouter()
const codeContent = ref('')
let isfires = true
onMounted(() => {
  initData()
})
onUnmounted(() => {
  time = null
  clearTimeout(time)
  console.log('onUnmounted')
})
const initData = () => {
  fileReadSync()
    .then((fileData: string) => {
      jsonObj = JSON.parse(fileData)
      // 在这里处理文件内容
      const result = Object.entries(jsonObj.url).map(([name, url]) => ({
        name,
        url
      })) as dataItemType[]
      tableData.value = result
    })
    .catch((err) => {
      console.error('读取时出错：', err)
    })
}
const buttonType = (name: string) => {
  isfires && name == jsonObj.current && (title.value = name)
  return name == jsonObj.current ? 'success' : ''
}
const btnClick = (name: string) => {
  //取消上次延时未执行的方法
  clearTimeout(time)
  time = setTimeout(function () {
    //do function在此处写单击事件要执行的代码
    title.value = name
    isfires = false
    isNoEmpty.value = isFileExists(name)
    if (isNoEmpty.value) {
      readCodeContent(name, false)
    }
  }, 300)
}
const doubleC = async (name: string) => {
  clearTimeout(time)
  const isNoEmpty = isFileExists(name)
  if (!isNoEmpty) {
    ElMessage.error(`${name}无下载，不能切换`)
    return
  }
  readCodeContent(name, true)
  console.log('doubleC', name)
}
const readCodeContent = (name: string, isdouble: boolean) => {
  const path = require('node:path')
  const fileStr = path.join(filePathHosts, `${name}.txt`)
  fileReadSync(fileStr)
    .then(async (fileData: string) => {
      codeContent.value = fileData
      if (isdouble) {
        isfires = true
        changeCurrent(name).then((res) => {
          console.log('changeCurrent---')
          initData()
          updateHostsFile(name, fileData)
        })
      }
    })
    .catch((err) => {
      console.error('读取时出错：', err)
    })
}
const downLoadHost = () => {
  console.log('downLoadHost')
  const item = tableData.value.find((item) => item.name == title.value)
  if (item!.url == '' || item?.url.length == 0) {
    ElMessage.error(`请设置${title.value}请求的URL`)
    clearTimeout(time)
    time = setTimeout(function () {
      router.push({
        name: 'changeHost'
      })
    }, 1000)
    return
  }
  fullscreenLoading.value = true
  downloadFile(item!.url, item!.name, (type: number, content: string) => {
    fullscreenLoading.value = false
    if (type == 0) {
      ElMessage.error(content)
    } else {
      ElMessage.success(content)
      const fileStr = item!.name
      readCodeContent(fileStr, false)
    }
  })
}
const handleChange = useDebounceFn(downLoadHost, 500)
</script>
<style scoped lang="less">
.layout-container-demo {
  border: 1px solid #c7cbd0;
  :deep(.el-space__item) {
    width: 100%;
    height: 60px;
  }
  .button-click:hover {
    background-color: #dfe1e4;
    border-radius: 0px;
  }
  .active {
    // background-color: red;
    // border-radius: 0px;
  }
  .code-container {
    white-space: pre-wrap;
    font-family: Consolas, monospace;
  }
  .header {
    border-bottom: 1px solid #c7cbd0;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    .toolbar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      > span {
        margin-right: 10px;
      }
    }
  }
}
</style>
