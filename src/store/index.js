import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth.js'
import menu from './modules/menu.js'
import loading from './modules/loading.js'
import users from './modules/users.js'
import VueTheMask from 'vue-the-mask'

Vue.use(Vuex);
Vue.use(VueTheMask)

export default new Vuex.Store({
	modules : {
		auth,
		loading,
		menu,
		users
	}
});