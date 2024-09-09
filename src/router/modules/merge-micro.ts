import { type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/merge-micro-app',
    children: [
      {
        path: 'merge-micro-app',
        name: 'mergeMicroApp',
        component: () => import('@/views/merge-micro-app/MergeMicroAppView.vue')
      }
    ]
  }
]
export default routes
