module.exports = function (server, routes, verify) {

	get('/photos', 'photos#index');
	get('/photo/:id', 'photos#show');

	get('/users', 'users#index');
	post('/user/verify', verify, 'users#log');
	get('/user/:id', 'users#show');


	// Route helpers.
	function use(method, route, controllers) {
		params = controllers.map(function (c) {
			if (typeof c === 'string') {
				var parts = c.split('#');
				return routes[parts[0]][parts[1]];
			}
			return c;
		});
		params.unshift(route);
		console.log('Routing', route, '->', controllers);
		server[method].apply(server, params);
	}
	function get(route) { use.call(null, 'get', route, [].slice.call(arguments).slice(1)); }
	function post(route) { use.call(null, 'post', route, [].slice.call(arguments).slice(1)); }
};