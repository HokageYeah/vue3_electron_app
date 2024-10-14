import { type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/host-list',
    meta: {
      title: 'Host文件',
      icon: 'letter-h'
    },
    children: [
      {
        path: 'host-list',
        name: 'changeHost',
        component: () => import('@/views/change-host/ChangeHostView.vue'),
        meta: { title: 'Host链接' }
      },
      {
        path: 'down-load-host-list',
        name: 'DownLoadHostList',
        component: () => import('@/views/change-host/DownLoadHostList.vue'),
        meta: { title: 'Host文件' }
      }
    ]
  }
]
export default routes
