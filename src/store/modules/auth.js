import {
	AUTH_REQUEST,
	AUTH_ERROR,
	AUTH_SUCCESS,
	CHECK_LOGIN,
	AUTH_LOGOUT
} from "../actions/auth";
import axios from 'axios'
import {URLS} from '../API_URL/URLS.js'

const state = {
	token: localStorage.getItem("user-token") || "",
	status: "",
	hasLoadedOnce: false,
	hasCheckLoginOnce: false
};

const getters = {
	isAuthenticated: state => !!state.token,
	authStatus: state => state.status
};

const actions = {

	[AUTH_REQUEST]: ({commit}, user) => {

		return new Promise((resolve, reject) => {
			commit(AUTH_REQUEST);

			axios({url: URLS.auth.login.path, data: user, method: URLS.auth.login.method })
			.then(resp => {
				const token     = resp.data.access_token
				,     tokenType = resp.data.token_type;

				localStorage.setItem('user-token', token);
				localStorage.setItem('user-token-type', tokenType);

				axios.defaults.headers.common['Authorization'] = tokenType + ' ' + token;

				commit(AUTH_SUCCESS, token);
				resolve(resp);
			})
			.catch(err => {
				commit(AUTH_ERROR, err);
				localStorage.removeItem('user-token');
				reject(err);
			})
		})
	},

	[AUTH_LOGOUT]: ({ commit }) => {
		commit(AUTH_REQUEST);

		return new Promise((resolve, reject) => {
			axios({url: URLS.account.logout.path,  method: URLS.account.logout.method })
			.then(resp => {
				commit(AUTH_LOGOUT)
				localStorage.removeItem('user-token')
				localStorage.removeItem('user-token-type')
				delete axios.defaults.headers.common['Authorization']

				resolve(resp);
			})
			.catch(err => {
				commit(AUTH_ERROR, err);
				reject(err);
			})
		})
	},

	[CHECK_LOGIN]: ({commit}) => {
		commit(AUTH_REQUEST);

		return new Promise((resolve, reject) => {
			axios({url: URLS.account.me.path, method: URLS.account.me.method})
			.then(response => {
				commit(CHECK_LOGIN, {
					status: 'success',
					token: state.token
				});
				resolve(response);

			})
			.catch(thrown => {
				commit(CHECK_LOGIN, {
					status: '',
					token: ''
				});
				reject(thrown);
			});
		})
	}
};

const mutations = {
	[AUTH_REQUEST]: (state) => {
		state.status = 'loading';
	},
	[AUTH_SUCCESS]: (state, token) => {
		state.status = 'success';
		state.token = token;
		state.hasLoadedOnce = true;
	},
	[AUTH_ERROR]: (state) => {
		state.status = 'error';
		state.hasLoadedOnce = true;
	},
	[CHECK_LOGIN]: (state, data) => {
		state.status = data.status;
		state.token = data.token;
		state.hasCheckLoginOnce = true;
	},
	[AUTH_LOGOUT]: state => {
		state.token = "";
		state.status = 'out';
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};