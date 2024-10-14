<template>
  <el-dialog :model-value="dialogVisible" :title="title" width="40%" draggable>
    <el-form ref="formRef" :model="numberValidateForm" label-width="100px" class="demo-ruleForm">
      <el-form-item
        label="项目地址"
        prop="url"
        :rules="[
          { required: true, message: '请选择文件夹' },
          { validator: validateEducation, trigger: 'blur' }
        ]"
      >
        <el-text v-show="numberValidateForm.url" class="mx-1">{{ numberValidateForm.url }}</el-text>
        <el-button type="primary" @click="btnHandleClick">选择文件</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
        <el-button @click="cancleDialog"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ipcRenderer } from 'electron'
const props = withDefaults(
  defineProps<{
    dialogVisible: boolean
    title: string
    dialogUrl: string
    createEiteAppType: number
    mainUrl: string
  }>(),
  {
    dialogVisible: false,
    title: '',
    dialogUrl: '',
    createEiteAppType: 0,
    mainUrl: ''
  }
)
const emits = defineEmits<{
  (e: 'update:dialogVisible', object: boolean): void
  (e: 'clickSure', url: string): void
}>()
defineOptions({ name: 'HostEditDialog' })
const formRef = ref<FormInstance>()
const numberValidateForm = reactive({
  url: props.dialogUrl
})
watch(
  () => props.dialogVisible,
  (newValue) => {
    if (newValue) {
      numberValidateForm.url = props.dialogUrl
    }
  },
  { deep: true }
)
function handleChange(data: any) {
  console.log('handleChange---', data)
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emits('update:dialogVisible', false)
      emits('clickSure', {
        url: numberValidateForm.url,
        mainUrl: props.mainUrl,
        type: props.createEiteAppType
      })
      numberValidateForm.url = ''
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const validateEducation = (rule: any, value: any, callback: any) => {
  const pattern = /^[^"'<>]*$/ // 正则表达式，禁止双引号和特殊字符
  if (!pattern.test(value)) {
    callback(new Error('不能输入特殊字符和双引号'))
  } else {
    callback()
  }
}
const cancleDialog = () => {
  emits('update:dialogVisible', false)
  numberValidateForm.url = ''
}

const btnHandleClick = () => {
  ipcRenderer.send('openFolderDialog')
}
onMounted(() => {
  // 使用ipc管道，接收主进程传递过来的文件夹路径
  ipcRenderer.on('folderPathChange', (event, message) => {
    const folderPath = message ? message[0] : ''
    numberValidateForm.url = folderPath
    console.log('传递过来的信息----folderPathChange---', message)
  })
})
</script>

<style scoped></style>
