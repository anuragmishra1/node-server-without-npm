/*
 * Router of the app
 *
 */

// Initaite the router
const router = {};

const stack = [];
this.route = {};

// Listing HTTP method, which are allowed
const methods = ['get', 'put', 'post', 'delete'];

// Create router HTTP method
methods.forEach(method => {
	router[method] = (path, fn) => {
		// Check the required fields are valid
		path = typeof(path) === 'string' && path.length > 0 ? path : false;
		fn = typeof(fn) === 'function' ? fn : false;

		if (path && fn) {
			const { regex, keys } = createPathRegexAndGetParamKeys(path);

			// Check path already exists
			if (!match(path)) {
				stack.push({
					'path': path,
					'handler': fn,
					'regex': regex,
					'keys': keys
				});
			} else {
				let msg = `Route path '${path}' created twice`;
				throw new Error(msg);
			}
		} else {
			let msg = `Route.${method}() requires a callback function`;
			throw new TypeError(msg);
		}

		return fn;
	};
});

// Check path exist or not, if exist return false
const match = (path) => {
	path = typeof(path) === 'string' && path.length > 0 ? path : false;
	if (path) {
		for (let route of stack) {
			let re = new RegExp(route.regex);
			if (re.test(path)) {
				this.route = route;
				return route;
			}
		}

		return false;
	} else {
		return false;
	}
};

// Return route handler and params for given path
const getRouteHandler = (path) => {
	path = typeof(path) === 'string' && path.length > 0 ? path : false;
	if (path) {
		if (this.route) {
			return {
				handler: this.route.handler,
				params: getParamValue(path, this.route.keys)
			};
		}
	} else {
		return new TypeError(`Requires path to get the router handler`);
	}
};

// Create regex for given path and get the params, if exist
const createPathRegexAndGetParamKeys = (path) => {
	let regex =  '^';
	const arr = splitPath(path);

	const keys = [];
	for (let [index, param] of arr.entries()) {
		if (param.includes(':')) {
			regex += '\\/(?:([^\\/]+?))';
			keys.push({
				'name': param.split(':')[1],
				'index': index
			});
		} else {
			regex += `\\/${param}`;
		}

		if (index === arr.length - 1) {
			regex += '\\/?$';
		}
	}

	return {
		regex,
		keys
	}
};

// Split URL path with '/' and return
const splitPath = (path) => {
	const arr = path.split('/');

	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === '') {
			arr.splice(i, 1);
		}
	}

	return arr;
};

// Get the key value of path parameter
const getParamValue = (path, keys) => {
	const params = {};
	if (path && keys.length > 0) {
		const arr = splitPath(path);
		for (let key of keys) {
			params[key.name] = arr[key.index]
		}

		return params;
	} else {
		return params;
	}
};

// Export Router module
module.exports = {
	router,
	match,
	getRouteHandler
};
