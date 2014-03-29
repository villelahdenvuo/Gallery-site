
module.exports = function (server, routes) {
	function get(route, controller) {
		var parts = controller.split('#');
		server.get(route, routes[parts[0]][parts[1]]);
	}

	get('/photos', 'photos#index');
	get('/photos/:id', 'photos#show');
};