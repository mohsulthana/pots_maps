import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import * as VueGoogleMaps from 'vue2-google-maps'
import { BootstrapVue, BIconFunnel } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.component('BIconFunnel', BIconFunnel)

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDQIsqjG31EQ8txoCb15E1SaZIzClUXdpY',
    libraries: 'places'
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
