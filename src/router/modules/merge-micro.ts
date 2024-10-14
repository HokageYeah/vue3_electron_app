import { type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/app-list',
    meta: {
      title: '微应用',
      icon: 'letter-h'
    },
    children: [
      {
        path: 'app-list',
        name: 'mergeMicroApp',
        component: () => import('@/views/merge-micro-app/MergeMicroAppView.vue'),
        meta: { title: '微应用列表' }
      }
    ]
  }
]
export default routes
