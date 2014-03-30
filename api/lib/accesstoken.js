module.exports = function (restify, request, User) {
	return function (req, res, next) {
		if (!req.headers['authorization']) {
			return next(new restify.UnauthorizedError("Invalid Access Token"));
		}
		request('https://graph.facebook.com/me?access_token=' + req.headers['authorization'],
		function (err, res, body) {
		  if (err) { return next(err); }
		  var data = JSON.parse(body);
		  //console.log('USER:', data);
		  User.findOrCreate({
		  	id: data.id,
		  	name: data.name
		  }, function (err, user) {
		  	req.user = user;
		  	next();
		  });
		});
	};
};