module.exports = function (restify, request, User) {
	// verify() -> just resolve user
	// verify({ admin: true }) -> verify admin
	return function (c) {
		if (!c)      { return verify(); }
		if (c.admin) { return verify(function (u) { return u.admin; }, 'You are not an admin!'); };
	};

	function verify(check, msg) {
		// No check provided, always true.
		if (!check) { check = function () { return true; }; }

		return function (req, res, next) {
			checkRquestToken(req, next, function (err, user) {
				next.ifError(err);
				if (!check(user)) { return next(new restify.UnauthorizedError(msg)); }
				req.user = user;
				return next();
			});
		};
	}

	function checkRquestToken(req, next, cb) {
		var token = req.headers['authorization'];

		if (!token) { return next(new restify.UnauthorizedError("Invalid Access Token")); }

		request({ url: 'https://graph.facebook.com/me?access_token=' + token, json: true },
		function (err, res, data) {
		  if (err) { return next(err); }
		  User.findOrCreate({ id: data.id, name: data.name }, cb);
		});
	}
};