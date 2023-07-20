<template>
  <div style="background-color: brown">
    <el-table :data="tableData" style="width: 100%; background-color: blueviolet" border>
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column prop="url" label="Url" width="220" />
      <el-table-column fixed="right" label="Operations" width="160" align="center">
        <template #default>
          <el-button type="primary" size="small" @click="handleClick">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import path from 'node:path'
import yeahurl from 'node:url'
import axios from 'axios'

const tableData = [
  {
    name: 'test',
    url: 'California'
  },
  {
    name: 'staging',
    url: 'California'
  },
  {
    name: 'prod',
    url: 'California'
  },
  {
    name: 'old-bak',
    url: 'California'
  },
  {
    name: 'dev',
    url: 'California'
  }
]
const handleClick = () => {
  console.log('handleClick')
}
const setFilePath = (filePath?: string) => {
  const url = import.meta.url
  debugger
  const __dirname = path.dirname(yeahurl.fileURLToPath(url))
  const crossPlatformPath = path.resolve(__dirname, filePath ?? '')
  return crossPlatformPath
}
const getData = async () => {
  try {
    const response = await axios.get('/hostAddress.json') // 发送 GET 请求获取 JSON 数据
    debugger
    console.log(response);
  } catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  // const path = setFilePath('../../assets/hostAddress.json')
  debugger
  getData()
})

defineOptions({ name: 'ChangeHostView' })
</script>
<style scoped lang="scss"></style>
