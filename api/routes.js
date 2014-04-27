module.exports = function (server, routes, verify) {
	var get = use.bind(0, 'get'), pst = use.bind(0, 'post')
		, del = use.bind(0, 'del'), put = use.bind(0, 'put');

	function use(method, route, middleware) {
		var p = [].slice.call(arguments, 2).map(function (c) {
			if (typeof c === 'string') { // string -> controller#method
				return routes[c.split('#')[0]][c.split('#')[1]];
			} else { return c; }
		});
		console.log('Routing', method.toUpperCase(), route, '->', p);
		p.unshift(route);
		server[method].apply(server, p);
	}

	//######################//
	//------- Routes -------//
	//######################//

	get('/photos',    'photos#index');
	get('/photo/:id', 'photos#show');
	del('/photo/:id', verify({ admin: true }), 'photos#destroy');
	pst('/photo/:id', verify({ admin: true }), 'photos#save');
	put('/photo',     verify({ admin: true }), 'photos#create');

	put('/rating', verify(), 'ratings#create');

	get('/tags',      'tags#index');
	get('/tag/:name', 'tags#show');
	put('/photo/:id/tag', verify(), 'tags#create');
	del('/photo/:id/tag', verify(), 'tags#destroy');

	//get('/users', 'users#index');
	//get('/user/:id', 'users#show');
};