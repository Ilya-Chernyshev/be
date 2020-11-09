import {
	SHOW_LOADING,
	HIDE_LOADING
} from "../actions/loading";

const state = {
	showLoading: false
};

const mutations = {
	[SHOW_LOADING]: (state) => {
		state.showLoading = true;
	},
	[HIDE_LOADING]: (state) => {
		state.showLoading = false;
	}
};

const actions = {
	[SHOW_LOADING]: ({ commit }) => {
		return new Promise((resolve) => {
			commit(SHOW_LOADING);
			resolve();
		})
	},
	[HIDE_LOADING] : ({commit}) => {
		return new Promise((resolve) => {
			commit(HIDE_LOADING);
			resolve();
		})
	}
};


const getters = {
	getStatusLoading: state => state.showLoading
};

export default {
	state,
	getters,
	mutations,
	actions
};