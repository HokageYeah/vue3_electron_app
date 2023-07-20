import { type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/changeHost',
    name: 'changeHost',
    component: () => import('@/views/changeHost/ChangeHostView.vue')
  }
]
export default routes
