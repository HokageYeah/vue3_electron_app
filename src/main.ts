import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupStore } from '@/stores'

const app = createApp(App)

// 注册pinia(这里不注册也可以，因为使用了AutoToPinia)
setupStore(app)
app.use(router)

app.mount('#app')
