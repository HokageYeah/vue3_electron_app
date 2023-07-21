import { type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/change-host',
    name: 'changeHost',
    component: () => import('@/views/change-host/ChangeHostView.vue')
  },
  {
    path: '/down-load-host-list',
    name: 'DownLoadHostList',
    component: () => import('@/views/change-host/DownLoadHostList.vue')
  }
]
export default routes
