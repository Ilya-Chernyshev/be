import {BASE_URL} from '../BASE/BASE_URL.js'
export const account = {
	me : {
		path: `${BASE_URL}account/me`,
		method: 'GET'
	},
	logout : {
		path: `${BASE_URL}account/logout`,
		method: 'POST'
	}
};