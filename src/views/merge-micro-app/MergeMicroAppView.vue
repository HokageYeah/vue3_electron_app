<template>
  <div class="micro-app-bg">
    <el-button type="primary" size="default" @click="createMacroApp">创建主应用</el-button>
    <el-table
      class="micro-app-table"
      :data="macroAppAry"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      v-loading="loading"
    >
      <el-table-column prop="name" label="应用名称" />
      <el-table-column prop="path" label="应用地址" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <!-- 主应用按钮 -->
          <el-button v-if="scope.row.type == 0"  type="primary" size="small" @click="editMacroApp(scope.row)">编辑主应用</el-button>
          <el-button v-if="scope.row.type == 0"  type="primary" size="small" @click="addMicroApp(scope.row)">添加微应用</el-button>
          <el-popconfirm
            v-if="scope.row.type == 0"
            confirm-button-text="确定"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="确定删除主应用?"
            @confirm="deleteMacroApp(scope.row)"
          >
            <template #reference>
              <el-button  type="danger" size="small">删除主应用</el-button>
            </template>
          </el-popconfirm>
          <!-- 微应用按钮 -->
          <el-button v-if="scope.row.type == 1"  type="success" size="small" @click="editMicroApp(scope.row)">编辑微应用</el-button>
          <el-popconfirm
            v-if="scope.row.type == 1"
            confirm-button-text="确定"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="确定删除微应用?"
            @confirm="deleteMicroApp(scope.row)"
          >
            <template #reference>
              <el-button  type="danger" plain size="small" >删除微应用</el-button>
            </template>
          </el-popconfirm>
          <el-button v-if="scope.row.type == 1"  type="primary" size="small" @click="buildMicroApp(scope.row)">构建</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <AddMaMicroAppDialog
    v-model:dialogVisible="dialogVisible"
    :dialog-url="dialogUrl"
    :main-url="mainUrl"
    :create-eite-app-type="createEiteAppType"
    :title="titleName"
    @click-sure="clickSure"
  />
  <el-dialog
    v-model="logVisible"
    title="构建日志"
    width="500"
  >
  <div class="log-container">
    <div v-for="(item, index) in logTestAry" :key="index"><strong style="font-weight: bold;">{{`${index + 1}、`}}</strong>{{ item }}<br></div>
  </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { id } from 'element-plus/es/locale';
import { InfoFilled } from '@element-plus/icons-vue'
import AddMaMicroAppDialog from './components/AddMaMicroAppDialog.vue'
import { microAppBuild } from '@/utils/build'
import { EventEmitter } from 'node:events'
import { ipcRenderer } from 'electron'
const dialogVisible = ref(false)
const loading = ref(false)
// 创建主应用或者微应用 0 创建主应用 1 添加微应用 2 编辑主应用 3 编辑微应用
const createEiteAppType = ref(0)
const dialogUrl = ref('')
const mainUrl = ref('')
const macroAppAry = ref([])
const events = new EventEmitter()
const logVisible = ref(false)
const logTestAry = ref([])
const createMacroApp = () => {
  dialogVisible.value = true
  dialogUrl.value = ''
  mainUrl.value = ''
  createEiteAppType.value = 0
}
const titleName = computed(() => {
  const obj = {
    0: '创建主应用',
    1: '创建微应用',
    2: '编辑主应用',
    3: '编辑微应用'
  }
  return obj[createEiteAppType.value]
})
// 主应用和微应用对象结构，内部存储的是地址path
// const obj = [
//   {
//     name: '主应用',
//     path: '',
//     children: [
//       {
//         name: '微应用',
//         path: ''
//       }
//     ]
//   }
// ]
onMounted(() => {
  // 存储在storeRage中
  const obj = JSON.parse(localStorage.getItem('macroAppAry') || '[]')
  macroAppAry.value = obj
  events.on('eventLogyuye', (data: any) => {
    console.log('传递过来的信息---eventLogyuye---', data)
    // logVisible.value = true
    // logTestAry.value.push(data)
  })
  console.log('eventLog---event--', events)
  // EventEmitter 监听
  // 使用ipc管道，接收主进程传递过来的文件夹路径
  ipcRenderer.on('eventLogVueProcess', (event, message) => {
    console.log('传递过来的信息----eventLogVueProcess---', message)
    logVisible.value = true
    logTestAry.value.push(message)
  })
})

const editMacroApp = (obj: any) => {
  console.log('editMacroApp---', obj)
  dialogVisible.value = true
  dialogUrl.value = obj.path
  mainUrl.value = obj.path
  createEiteAppType.value = 2
}
const addMicroApp = (obj: any) => {
  dialogVisible.value = true
  dialogUrl.value = ''
  mainUrl.value = obj.path
  createEiteAppType.value = 1
  console.log('addMicroApp---', obj)
}
const deleteMacroApp = (obj: any) => {
  console.log('deleteMacroApp---', obj)
  const index = macroAppAry.value.findIndex((item: any) => item.path === obj.path)
  if (index > -1) {
    macroAppAry.value.splice(index, 1)
    localStorage.setItem('macroAppAry', JSON.stringify(macroAppAry.value))
  }
}
const deleteMicroApp = (obj: any) => {
  console.log('deleteMicroApp---', obj)
  const index = macroAppAry.value.findIndex((item: any) => item.id === obj.parentId)
  if (index > -1) {
    macroAppAry.value[index].children = macroAppAry.value[index].children.filter((item: any) => item.path !== obj.path)
    localStorage.setItem('macroAppAry', JSON.stringify(macroAppAry.value))
  }
}
const editMicroApp = (obj: any) => {
  console.log('editMicroApp---', obj)
  const {parentId, id} = obj
  const macroObj = macroAppAry.value.find((item: any) => item.id === parentId)
  if(!macroObj) return
  dialogVisible.value = true
  dialogUrl.value = obj.path
  mainUrl.value = macroObj.path
  createEiteAppType.value = 3
}
const buildMicroApp = async (obj: any) => {
  console.log('buildMicroApp---', obj)
  const {parentId, id} = obj
  const macroObj = macroAppAry.value.find((item: any) => item.id === parentId)
  if(!macroObj) return
  loading.value = true
  try {
    await microAppBuild(macroObj.path, macroObj.name, obj.path, obj.name, events)
    ElMessage({
      message: '构建成功',
      type: 'success',
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log('error---', error)
    ElMessage({
      message: error.message,
      type: 'error',
      plain: true,
      showClose: true,
      duration:6000
    })
  }
}
const confirm = (obj: any) => {
  console.log('confirm---', obj)
}
const clickSure = (obj: any) => {
  console.log('clickSure---', obj)
  const { url, mainUrl, type } = obj
  const name = url.split('/').pop()
  // 0 创建主应用 1 创建微应用 2 编辑主应用 3 编辑微应用
  switch (type) {
    case 0:
      {
        // 先判断是否有主应用
        const mainIndex = macroAppAry.value.findIndex((item: any) => item.path === url)
        if (mainIndex > -1) {
          ElMessage.error('该主应用已存在')
          return
        }
        macroAppAry.value.push({
          id: Date.now(),
          name,
          path: url,
          type: 0,
          children: []
        })
      }
      break
    case 1:
      {
        const mainIndex = macroAppAry.value.findIndex((item: any) => item.path === mainUrl)
        if (mainIndex > -1) {
          const microIndex = macroAppAry.value[mainIndex].children.findIndex(
            (item: any) => item.path === url
          )
          if (microIndex > -1) {
            ElMessage.error('该微应用已存在')
            return
          }
          macroAppAry.value[mainIndex].children.push({
            id: Date.now(),
            parentId: macroAppAry.value[mainIndex].id,
            name,
            path: url,
            type: 1
          })
        }
      }
      break
    case 2:
      {
        const mainIndex = macroAppAry.value.findIndex((item: any) => item.path === mainUrl)
        if (mainIndex > -1) {
          const mainObj = macroAppAry.value[mainIndex]
          mainObj.name = name
          mainObj.path = url
          macroAppAry.value.splice(mainIndex, 1, mainObj)
        }
      }
      break
    case 3:
      {
        const mainIndex = macroAppAry.value.findIndex((item: any) => item.path === mainUrl)
        if (mainIndex > -1) {
          const microIndex = macroAppAry.value[mainIndex].children.findIndex(
            (item: any) => item.path === dialogUrl.value
          )
          if (microIndex > -1) {
            const microObj = macroAppAry.value[mainIndex].children[microIndex]
            microObj.name = name
            microObj.path = url
            macroAppAry.value[mainIndex].children.splice(microIndex, 1, microObj)
          }
        }
      }
      break
  }
  localStorage.setItem('macroAppAry', JSON.stringify(macroAppAry.value))
  console.log('macroAppAry---', macroAppAry.value)
}
</script>

<script lang="ts">
export default {
  name: 'MergeMicroApp'
}
</script>

<style scoped lang="scss">
.micro-app-bg {
  height: 95vh;
}
.micro-app-table {
  :deep(.el-table__row--level-1) {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
}
.log-container{
  max-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: auto;
  div {
    margin-top: 8px;
  }
}
</style>
