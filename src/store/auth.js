import axios from 'axios'

const urls = {
	auth : 'https://mvp.api.beinsport.ru/api/v1/auth/login'
};

export default {
	actions  : {
		AUTH_REQUEST: ({commit}, user) => {
			return new Promise((resolve, reject) => {
				commit('AUTH_REQUEST');

				axios({url: urls.auth, data: user, method: 'POST' })
				.then(resp => {
					const token     = resp.data.access_token
					,     tokenType = resp.data.token_type;

					localStorage.setItem('user-token', token);
					localStorage.setItem('user-token-type', tokenType);

					axios.defaults.headers.common['Authorization'] = tokenType + ' ' + token;

					commit('AUTH_SUCCESS', token);
					resolve(resp);
				})
				.catch(err => {
					commit('AUTH_ERROR', err);
					localStorage.removeItem('user-token');
					reject(err);
				})
			})
		},
		AUTH_LOGOUT: ({commit, dispatch}) => {
			return new Promise((resolve, reject) => {
				commit('AUTH_LOGOUT')
				localStorage.removeItem('user-token')
				delete axios.defaults.headers.common['Authorization']
				resolve()
			})
		},
		CHECK_LOGIN: ({commit, dispatch}) => {
			return new Promise((resolve, reject) => {
				axios({url: 'https://mvp.api.beinsport.ru/api/v1/account/me', method: 'GET'})
				.then(response => {
					resolve(response);
				})
				.catch(thrown => {
					commit('CHECK_LOGIN');
					reject(thrown);
				});
			})
		}
	},
	mutations : {
		AUTH_REQUEST: (state) => {
			state.status = 'loading';
		},
		AUTH_SUCCESS: (state, token) => {
			state.status = 'success';
			state.token = token;
		},
		AUTH_ERROR: (state) => {
			state.status = 'error';
		},
		CHECK_LOGIN: (state) => {
			state.status = 'loading';
			state.token = '';
		},

	},
	state    : {
		token: localStorage.getItem('user-token') || '',
		status: ''
	},
	getters  : {
		isAuthenticated: state => !!state.token,
		authStatus: state => state.status
	}
}