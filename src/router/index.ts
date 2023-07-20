import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { type RouteRecordRaw } from 'vue-router'

const modules: any = import.meta.glob('./modules/**/*.ts', { eager: true })
const routeModuleList: RouteRecordRaw[] = []
// eslint-disable-next-line no-debugger
console.log(modules)
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
  console.log(routeModuleList)
})
// 进行正排序
function sortRoute(a: RouteRecordRaw, b: RouteRecordRaw) {
  return (Number(a.meta?.sort) || 0) - (Number(b.meta?.sort) || 0)
}
routeModuleList.sort(sortRoute)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeModuleList
})

export default router
