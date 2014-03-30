module.exports = function (restify, request, User) {
	var routes = {};

	// List all users.
	routes.index = function (req, res) {
		User.all(function (err, users) {
			res.send(err || users);
		});
	};

	// Get a single user by id.
	routes.show = function (req, res, next) {
		// TODO: validate id as Number.
		User.findOne({id: req.params.id}, function (err, user) {
			if (!user) { return next(new restify.NotFoundError('Requested user not found.')); }
			res.send(user);
		});
	};

	routes.log = function (req, res, next) {
		console.log('logged', req.user);
		res.send(200, req.user);
	};

	return routes;
};