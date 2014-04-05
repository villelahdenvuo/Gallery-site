module.exports = function (restify, request, User) {
	// verify() -> check user
	// verify({ admin: true }) -> verify admin
	return function (c) {
		if (!c)      { return checkUser; }
		if (c.admin) { return checkAdmin; };
	};

	function checkHeaders(req, next) {
		if (!req.headers['authorization']) {
			return next(new restify.UnauthorizedError("Invalid Access Token"));
		}
	}

	function checkUser(req, res, next) {
		checkHeaders(req, next);
		checkToken(req.headers['authorization'], function (err, user) {
			if (err) { return next(err); }
			req.user = user;
			next();
		});
	};

	function checkAdmin(req, res, next) {
		if (!req.headers['authorization']) {
			return next(new restify.UnauthorizedError("Invalid Access Token"));
		}
		checkToken(req.headers['authorization'], function (err, user) {
			if (err) { return next(err); }
			if (!user.admin) { return next(new restify.UnauthorizedError("Access denied!")); }
			req.user = user;
			next();
		});
	};

	function checkToken(token, cb) {
		request('https://graph.facebook.com/me?access_token=' + token,
		function (err, res, body) {
		  if (err) { return cb(err); }
		  var data = JSON.parse(body);
		  User.findOrCreate({ id: data.id, name: data.name }, cb);
		});
	}
};