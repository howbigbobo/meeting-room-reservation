var Filters = {};
function Factory(name) {
	var filters = {};
	function registe(url) {
		for (var i = 0; i < arguments.length; i++) {
			filters[arguments[i]] = true;
		}
	}
	function contains(url) {
		if (url && url[url.length-1] === "/") {
			url = url.substring(0, url.length - 1);
		}
		return filters[url];
	}

	Filters[name] = {
		name: name,
		registe: registe,
		contains: contains
	};
	return Filters[name];
};

module.exports = {
	get: function (name) {
		return Filters[name] || new Factory(name);
	}
};