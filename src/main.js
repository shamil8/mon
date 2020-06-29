import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import locale from 'element-ui/lib/locale'

import 'echarts'

Vue.config.productionTip = false
Vue.use(Element)
locale.use(lang)

new Vue({
  render: h => h(App)
}).$mount('#app')
