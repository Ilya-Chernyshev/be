import {BASE_URL} from '../BASE/BASE_URL.js'

export const admin = {
	users : {
		path: `${BASE_URL}admin/users`,
		method: 'GET',
		params: {
			perPage: 'per_page',
			page: 'page',
		}
	},
	mass : {
		path: `${BASE_URL}admin/users/mass`,
		method: 'PUT'
	}
};