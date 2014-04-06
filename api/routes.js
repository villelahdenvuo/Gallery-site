module.exports = function (server, routes, verify) {

	get ('/photos',    'photos#index');
	get ('/photo/:id', 'photos#show');
	del ('/photo/:id', verify({ admin: true }), 'photos#destroy');
	post('/photo/:id', verify({ admin: true }), 'photos#save');
	put ('/photo',     verify({ admin: true }), 'photos#create');

	get('/users', 'users#index');
	//post('/user/verify', verify(), 'users#log');
	get('/user/:id', 'users#show');


	// Route helpers.
	function get (r) { use.call(0, 'get',  r, [].slice.call(arguments, 1)); }
	function post(r) { use.call(0, 'post', r, [].slice.call(arguments, 1)); }
	function del (r) { use.call(0, 'del',  r, [].slice.call(arguments, 1)); }
	function put (r) { use.call(0, 'put',  r, [].slice.call(arguments, 1)); }

	function use(method, route, middleware) {
		var p = middleware.map(function (c) {
			if (typeof c === 'string') { // string -> controller#method
				return routes[c.split('#')[0]][c.split('#')[1]];
			} else { return c; }
		});
		console.log('Routing', method.toUpperCase(), route, '->', middleware);
		p.unshift(route);
		server[method].apply(server, p);
	}
};