<template>
  <div style="background-color: brown;">
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column prop="url" label="Url" />
      <el-table-column fixed="right" label="Operations" width="160" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleClick(scope.$index)">编辑</el-button>
          <el-button type="danger" size="small" @click="removeUrl(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <HostEditDialog
    v-model:dialogVisible="dialogVisible"
    :dialogUrl="dialogUrl"
    @clickSure="clickSure"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import { fileReadSync, fileWriteSync, type dataItemType } from '@/utils/file_path'
import HostEditDialog from './components/HostEditDialog.vue'
import axios from 'axios'
defineOptions({ name: 'ChangeHostView' })


const dialogUrl = ref('')
let clickindex = 0
let jsonObj: any = {}

const tableData: Ref<dataItemType[]> = ref([])
const dialogVisible = ref(false)
const handleClick = (index: number) => {
  dialogVisible.value = true
  clickindex = index
  dialogUrl.value = tableData.value[index].url
  console.log('handleClick')
}
const removeUrl = (index: number) => {
  clickindex = index
  clickSure('')
}
// 请求可以拿到，但是打包后拿不到
const getData = async () => {
  try {
    const response = await axios.get('/hostAddress.json') // 发送 GET 请求获取 JSON 数据
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fileReadSync()
    .then((fileData: string) => {
      jsonObj = JSON.parse(fileData)
      // 在这里处理文件内容
      const result = Object.entries(jsonObj.url).map(([name, url]) => ({ name, url })) as dataItemType[]
      tableData.value = result
    })
    .catch((err) => {
      console.error('读取时出错：', err)
    })
})

const clickSure = (url: string) => {
  tableData.value[clickindex].url = url
  // 将数据转换为对象
  const transformedData: any = {}
  tableData.value.forEach((item) => {
    transformedData[item.name] = item.url
  })
  jsonObj.url = transformedData
  fileWriteSync(jsonObj)
    .then((str: string) => {
      ElMessage({
        message: str,
        type: 'success'
      })
    })
    .catch((err) => {
      ElMessage.error(err)
    })
  console.log(tableData.value)
}

</script>
<style scoped lang="scss"></style>
