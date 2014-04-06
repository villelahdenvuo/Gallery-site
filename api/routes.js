module.exports = function (server, routes, verify) {

	get('/photos', 'photos#index');
	get('/photo/:id', 'photos#show');
	del('/photo/:id', verify({ admin: true }), 'photos#destroy');
	post('/photo/:id', verify({ admin: true }), 'photos#save');
	put('/photo', verify({ admin: true }), 'photos#create');

	get('/users', 'users#index');
	post('/user/verify', verify(), 'users#log');
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
		console.log('Routing', method.toUpperCase(), route, '->', controllers);
		server[method].apply(server, params);
	}
	function get(route) { use.call(null, 'get', route, [].slice.call(arguments, 1)); }
	function post(route) { use.call(null, 'post', route, [].slice.call(arguments, 1)); }
	function del(route) { use.call(null, 'del', route, [].slice.call(arguments, 1)); }
	function put(route) { use.call(null, 'put', route, [].slice.call(arguments, 1)); }
};