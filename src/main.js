import Vue from 'vue'
import store from './store'
import router from './router'
import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { 
	ValidationObserver,
  ValidationProvider,
  extend,
  localize
 } from 'vee-validate'

import * as rules from "vee-validate/dist/rules";
import ru from "vee-validate/dist/locale/ru.json";
import VueTheMask from 'vue-the-mask'
import App from './App.vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueTheMask)
Vue.use(axios)

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

localize("ru", ru);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.config.productionTip = false;

const token = localStorage.getItem('user-token');
const tokenType = localStorage.getItem('user-token-type');

if (token) {
  axios.defaults.headers.common['Authorization'] = tokenType + ' ' + token;
}

new Vue({
	store,
	router,
  render: h => h(App),
}).$mount('#app');
