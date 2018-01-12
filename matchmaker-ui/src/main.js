import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import { calculateAge, date, parseIso8601 } from './filters'

Vue.config.productionTip = false

import('vuetify/dist/vuetify.min.css')
Vue.use(Vuetify)

Vue.filter('date', date)
Vue.filter('parseIso8601', parseIso8601)
Vue.filter('age', calculateAge)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
