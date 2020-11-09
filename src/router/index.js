import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import Auth from '@/components/auth/Auth.vue'
import Main from '@/components/main/Main.vue'
import Users from '@/components/Pages/Users.vue'
import NotFound from '@/components/Error/NotFound.vue'

const toggleClassBody = (flag) => {
	if (flag) {
		document.body.classList.add('auth');
		return;
	}
	document.body.classList.remove('auth');
}

const ifNotAuthenticated = (to, from, next) => {
	store.dispatch('HIDE_LOADING');

	if (!store.getters.isAuthenticated) {
		toggleClassBody(true);
		store.dispatch('HIDE_MENU');
		store.dispatch('HIDE_LOADING');

		next();
		return
	}
	toggleClassBody();
	store.dispatch('BEFORE_SHOW_MENU');

	next('/');

}

const ifAuthenticated = (to, from, next) => {
	store.dispatch('SHOW_LOADING');
	toggleClassBody();

	store.dispatch('CHECK_LOGIN').then(() => {
		store.dispatch('BEFORE_SHOW_MENU');
		store.dispatch('SHOW_MENU');
		store.dispatch('HIDE_LOADING');

		next()
	})
	.catch(() => {
		store.dispatch('HIDE_MENU');
		next('/auth')
	});
}


Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	routes: [{
		path: '/auth',
		name: 'Auth',
		component: Auth,
		beforeEnter: ifNotAuthenticated
	},
	{
		path: '/',
		name: 'main',
		component: Main,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/users',
		name: 'users',
		component: Users,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/404',
		name: '404',
		component: NotFound,
		beforeEnter: ifAuthenticated
	},
	{ 
		path: '*', 
		redirect: '/404' 
	}]
});


export default router; 