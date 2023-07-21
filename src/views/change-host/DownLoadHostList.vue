<template>
  <el-container class="layout-container-demo" style="height: 500px">
    <el-aside style="background-color: orange" width="100px">
      <el-scrollbar>
        <el-space direction="vertical" style="width: 100%">
          <el-button
            class="button-click"
            style="width: 100%"
            v-for="button in tableData"
            :key="button.name"
            size="large"
            :type="buttonType(button.name)"
            link
            @click="btnClick(button.name)"
            >{{ button.name }}</el-button
          >
        </el-space>
      </el-scrollbar>
    </el-aside>
    <el-container style="background-color: red">
      <el-header class="header">
        <div class="toolbar">
          <span>{{ title }}</span>
          <el-button type="danger" :icon="Delete" circle> </el-button>
        </div>
      </el-header>
      <el-main>
        <el-scrollbar>
          <span>asdasdsd</span>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { fileReadSync, fileWriteSync, type dataItemType } from '@/utils/file_path'
import { ref, computed, onMounted, type Ref } from 'vue'
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
defineOptions({ name: 'DownLoadHostList' })
let jsonObj: any = {}
const tableData: Ref<dataItemType[]> = ref([])
const title = ref('')
onMounted(() => {
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
})
const buttonType = (name: string) => {
  name == jsonObj.current && (title.value = name)
  return name == jsonObj.current ? 'success' : ''
}
const btnClick = (name: string) => {
  title.value = name
}
</script>
<style scoped lang="less">
.layout-container-demo {
  :deep(.el-space__item) {
    width: 100%;
    height: 100%;
    // padding: 30px;
    height: 60px;
  }
  .button-click {
  }
  .header {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    background-color: aqua;
    .toolbar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }
}
</style>
