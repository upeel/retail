import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { store } from './store'
import vuetify from './plugins/vuetify'
import i18n from '@/plugins/i18n'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import './assets/sass/app.scss'
import './plugins/vue-phone-number-input'
import './plugins/vee-validate'
import './plugins/vue2-leaflet'
import './plugins/vue-verification-code-input'
import MaskMoney from './directive/MaskMoney'
import MaskMoneyNoCurrency from './directive/MaskMoneyNoCurrency'
import './prototype/index'

Vue.use(MaskMoney)
Vue.use(MaskMoneyNoCurrency)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
