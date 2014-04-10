module.exports = function (restify, Rating) {
	var routes = {};

	routes.index = function index(req, res) {
		Rating.all(function (err, ratings) {
			res.send(err || ratings);
		});
	};

	routes.show = function show(req, res, next) {
		// TODO: validate id as Number.
		Rating.findOne({id: req.params.id}, function (err, rating) {
			if (!rating) { return next(new restify.NotFoundError('Requested rating not found.')); }
			res.send(rating);
		});
	};

/*	routes.destroy = function destroy(req, res, next) {
		Rating.findOne({id: req.params.id}, function (err, rating) {
			if (!rating) { return next(new restify.NotFoundError('Requested rating not found.')); }
			rating.destroy(function (err) {
				res.send(err || 204);
			});
		});
	}*/

	routes.create = function create(req, res, next) {
		var data = {
			user_id: req.user.id,
			photo_id: req.params.photo_id,
		};

		rating = Rating.findOrCreate(data, function (err, rating) {
			if (err) { return next(err); }
			// If score has changed, update it.
			if (rating.score != req.params.score) {
				console.log(req.user.name, 'updated score from', rating.score, 'to', req.params.score, 'for image', data.photo_id);
				rating.score = req.params.score;
				rating.save(function (err) {
					res.send(err || 204);
				});
			} else {
				res.send(204);
			}
		});

	}

	return routes;
};