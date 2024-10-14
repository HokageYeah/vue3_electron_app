import { cloneDeep } from 'lodash'
import { routeModuleList } from '@/router/index'
const permissionStore = defineStore({
  id: 'permissionStore',
  state: () => {
    return {
      routes: cloneDeep(routeModuleList)
    }
  }
})
export default permissionStore
