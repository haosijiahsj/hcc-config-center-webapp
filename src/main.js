import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueClipboard)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
