import { type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/change-host',
    meta: {
      title: 'Host文件',
      icon: 'letter-h'
    },
    children: [
      {
        path: 'change-host',
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
