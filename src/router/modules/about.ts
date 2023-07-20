import { type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  }
]
export default routes
