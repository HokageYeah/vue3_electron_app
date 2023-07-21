<template>
  <el-dialog :modelValue="dialogVisible" title="URL修改" width="40%" draggable>
    <el-form ref="formRef" :model="numberValidateForm" label-width="50px" class="demo-ruleForm">
      <el-form-item
        label="url"
        prop="url"
        :rules="[
          { required: true, message: '请填写正确的URL' },
          { validator: validateEducation, trigger: 'blur' }
        ]"
      >
        <el-input v-model.number="numberValidateForm.url" type="text" autocomplete="off" />
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
import { ref, reactive, watch } from 'vue'
import type { FormInstance } from 'element-plus'
defineOptions({ name: 'HostEditDialog' })
const emits = defineEmits<{
  (e: 'update:dialogVisible', object: boolean): void
  (e: 'clickSure', url: string): void
}>()
const props = withDefaults(
  defineProps<{
    dialogVisible: boolean
    dialogUrl: string
  }>(),
  {
    dialogVisible: false,
    dialogUrl: ''
  }
)
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
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emits('update:dialogVisible', false)
      emits('clickSure', numberValidateForm.url)
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
</script>
<style scoped></style>
