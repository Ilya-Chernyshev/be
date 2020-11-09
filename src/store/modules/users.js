import {
	ALL_USERS,
	TOTAL_USERS,
	CURRENT_PAGE_USERS,
	PER_PAGE_USERS,
	LAST_PAGE_USERS,
	FIELDS_USERS_TABLE,
	UPDATE_USERS
} from "../actions/users";
import axios from 'axios'
import {URLS} from '../API_URL/URLS.js'
import {getParams} from '../API_URL/common.js'

const state = {
	users: [],
	totalUsers: '',
	currentPage: 1,
	perPage: 3,
	lastPage: 1,
	fields: [
	{ key: 'index', label: '№'},
	{ key: 'last_name', label: 'Фамилия'},
	{ key: 'first_name', label: 'Имя'},
	{ key: 'sex', label: 'Пол'},
	{ key: 'age', label: 'Возраст'},
	{ key: 'phone', label: 'Телефон'},
	{ key: 'is_approved', label: 'Подтвержден'},
	{ key: 'visit_number', label: 'Кол-во посещений'},
	{ key: 'company_id', label: 'Компания'},
	{ key: 'avatar', label: 'Аватарка'},
	{ key: 'created_at', label: 'Дата регистрации'}
	]
};

const getters = {
	getPerPage: state => state.perPage,
	getUsersAddID : state => {
		let arrResultUsers = [];

		for (var i = 0; i < state.users.length; i++) {
			var id = state.users[i].id;
			let resultObj = {}
			for (let key in state.users[i]) {
				let resultPropObj  = {};
				resultPropObj[key] = state.users[i][key];
				resultPropObj.id   = id;
				resultObj[key]     = resultPropObj;
			}
			arrResultUsers.push(resultObj);
		}
		return arrResultUsers;
	},
	getUserDataID: state => id => {
		for (var i = 0; i < state.users.length; i++) {
			if(state.users[i].id === id){
				return state.users[i];
			}
		}
		return null;
	}

};
const mutations = {
	[ALL_USERS]: (state, data) => {
		state.users = data;
	},
	[TOTAL_USERS]: (state, data) => {
		state.totalUsers = data;
	},
	[CURRENT_PAGE_USERS]: (state, data) => {
		state.currentPage = data;
	},
	[PER_PAGE_USERS]: (state, data) => {
		state.perPage = data;
	},
	[LAST_PAGE_USERS]: (state, data) => {
		state.lastPage = data;
	},
	[FIELDS_USERS_TABLE]: (state, data) => {
		state.fields = data;
	},
	[UPDATE_USERS]: (state, data) => {
		for (let x = 0; x < data.length; x++) {
			for (let i = 0; i < state.users.length; i++) {
				if (data[x].id === state.users[i].id) {
					for (let key in data[x]) {
						state.users[i][key] = data[x][key];
					}
				}
			}
		}
	}
};

const actions = {
	[ALL_USERS]: ({ commit }) => {
		var getParamsStr = getParams({
			[URLS.admin.users.params.perPage] : state.perPage,
			[URLS.admin.users.params.page] : state.currentPage
		});
		return new Promise((resolve, reject) => {
			axios({url: `${URLS.admin.users.path}?${getParamsStr}`,  method: URLS.admin.users.method })
			.then((response) => {
				commit(TOTAL_USERS, response.data.total);
				commit(CURRENT_PAGE_USERS, response.data.current_page);
				commit(LAST_PAGE_USERS, response.data.last_page);
				commit(PER_PAGE_USERS, response.data.per_page);
				commit(ALL_USERS, response.data.data);
				resolve(response);
			})
			.catch((req) => {
				reject(req);
			})
		})
	},
	[UPDATE_USERS]: ({ commit }, data) => {
		console.log(data)
		return new Promise((resolve, reject) => {
			axios({url: URLS.admin.mass.path, data: data, method: URLS.admin.mass.method })
			.then((response) => {
				commit(UPDATE_USERS, data);
				resolve(response);
			})
			.catch((req) => {
				reject(req);
			})
		})
	}

};

export default {
	state,
	getters,
	mutations,
	actions
};