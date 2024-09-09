import { routeModuleList } from '@/router/index'
const permissionStore = defineStore('permissionStore', () => {
  console.log('permissionStore---', routeModuleList)
  const permission = ref({
    permissionRoutes: []
  })
  return { permission }
})
export default permissionStore
