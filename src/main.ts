import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './style.css'

const pinia = createPinia()
pinia.use(createPersistedState({
    storage: sessionStorage,
}))
createApp(App).use(router).use(pinia).mount('#app')