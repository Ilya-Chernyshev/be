export const getParams = function(obj) {
	if (obj && JSON.stringify(obj) !== '{}') {
		let str = "";
		for (let key in obj) {
			if (str != "") {
				str += "&";
			}
			str += key + "=" + encodeURIComponent(obj[key]);
		}	
		return str;
	}
	return '';
}