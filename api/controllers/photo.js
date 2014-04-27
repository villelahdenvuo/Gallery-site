module.exports = function (restify, Photo) {
	var async = require('async');
	var routes = {};

	routes.index = function index(req, res, next) {
		Photo.all(function (err, photos) {
			next.ifError(err);

			async.map(photos, function (photo, cb) {
				photo.populateFields(cb);
			}, function (err) { res.send(err || photos); });
		});
	};

	routes.show = function show(req, res, next) {
		Photo.findOne({id: req.params.id}, function (err, photo) {
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }

			photo.populateFields(function (err) {
				res.send(err || photo);
			});
		});
	};

	routes.destroy = function destroy(req, res, next) {
		Photo.findOne({id: req.params.id}, function (err, photo) {
			next.ifError(err);
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }
			photo.destroy(function (err) {
				res.send(err || 204);
			});
		});
	}

	routes.create = function create(req, res, next) {
		photo = Photo.create(req.params);
		photo.save(function (err, valid) {
			if (!valid) {
				res.send(400, err);
			} else {
				res.send(err || 204);
			}
		});
	}

	routes.save = function save(req, res, next) {
		Photo.findOne({id: req.params.id}, function (err, photo) {
			next.ifError(err);
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }
			photo.name = req.params.name;
			photo.description = req.params.description;
			photo.save(function (err) {
				res.send(err || 204);
			});
		});
	}

	return routes;
};