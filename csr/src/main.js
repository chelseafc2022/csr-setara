import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import header from './components/headerx.vue'   
import footer from './components/footerx.vue'
import sidecontentnews from './components/sidecontentnews.vue'

 


createApp(App)
.use(store)
.use(router)
.component('headerx', header)
.component('footerx', footer)
.component('sidecontentnews', sidecontentnews)
.mount('#app')
