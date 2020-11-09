import {
	SHOW_MENU,
	BEFORE_SHOW_MENU,
	HIDE_MENU
} from "../actions/menu";

const state = {
	menuList: [
		{
			name: 'Пользователи',
			href: 'users'
		}
	],
	beforeShowMenu: false,
	showMenu: false
};

const mutations = {
	[SHOW_MENU]: (state) => {
		state.showMenu = true;
	},
	[HIDE_MENU]: (state) => {
		state.showMenu = false;
	},
	[BEFORE_SHOW_MENU]: (state) => {
		state.beforeShowMenu = true;
	}
};

const actions = {
	[SHOW_MENU]: ({ commit }) => {
		return new Promise((resolve) => {
			commit(SHOW_MENU);
			resolve();
		})
	},
	[HIDE_MENU] : ({commit}) => {
		return new Promise((resolve) => {
			commit(HIDE_MENU);
			resolve();
		})
	},
	[BEFORE_SHOW_MENU] : ({commit}) => {
		return new Promise((resolve) => {
			commit(BEFORE_SHOW_MENU);
			resolve();
		})
	}
};


const getters = {
	getMenuList: state => state.menuList,
	getStatusMenu: state => state.showMenu
};

export default {
	state,
	getters,
	mutations,
	actions
};