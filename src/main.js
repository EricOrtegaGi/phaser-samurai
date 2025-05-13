import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import LoadingOverlay from './components/LoadingOverlay.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('LoadingOverlay', LoadingOverlay)
app.mount('#app')
