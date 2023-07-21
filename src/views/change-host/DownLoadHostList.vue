<template>
  <el-container class="layout-container-demo" style="height: 500px">
    <el-aside style="background-color: orange" width="100px">
      <el-scrollbar>
        <el-space direction="vertical" style="width: 100%">
          <el-button
            style="width: 100%"
            v-for="button in tableData"
            :key="button.name"
            size="large"
            :type="buttonType"
            link
            >{{ button.name }}</el-button
          >
        </el-space>
      </el-scrollbar>
    </el-aside>
    <el-container style="background-color: red"></el-container>
  </el-container>
</template>

<script setup lang="ts">
import { fileReadSync, fileWriteSync, type dataItemType } from '@/utils/file_path'
import { ref, reactive, onMounted, type Ref } from 'vue'
defineOptions({ name: 'DownLoadHostList' })

const buttonType = ''
const tableData: Ref<dataItemType[]> = ref([])
onMounted(() => {
  fileReadSync()
    .then((fileData: string) => {
      const jsonObj = JSON.parse(fileData)
      // 在这里处理文件内容
      const result = Object.entries(jsonObj).map(([name, url]) => ({ name, url })) as dataItemType[]
      tableData.value = result
    })
    .catch((err) => {
      console.error('读取时出错：', err)
    })
})
</script>
<style scoped lang="less">
.layout-container-demo {
  :deep(.el-space__item) {
    width: 100%;
    height: 100%;
    padding: 30px;
  }
}
</style>
