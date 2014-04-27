module.exports = function (restify, Rating) {
	var routes = {};

	routes.index = function index(req, res) {
		Rating.all(function (err, ratings) {
			res.send(err || ratings);
		});
	};

	routes.show = function show(req, res, next) {
		Rating.findOne({id: req.params.id}, function (err, rating) {
			next.ifError(err);
			if (!rating) { return next(new restify.NotFoundError('Requested rating not found.')); }
			res.send(rating);
		});
	};

	routes.create = function create(req, res, next) {
		Rating.findOrCreate({ user_id: req.user.id, photo_id: req.params.photo_id },
		function (err, rating) {
			next.ifError(err);
			// If score has not changed, skip.
			if (rating.score === req.params.score) { return res.send(204); }

			console.log(req.user.name, 'updated score', rating.score, '->', req.params.score, 'for', data.photo_id);
			rating.score = req.params.score;
			rating.save(res.respondValid);
		});
	};

	return routes;
};