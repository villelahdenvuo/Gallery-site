module.exports = function (restify, Photo) {
	var async = require('async');
	var routes = {};

	// List all photos.
	routes.index = function index(req, res) {
		Photo.all(function (err, photos) {
			if (err) { return next(err); }

			async.map(photos, function (photo, cb) {
				photo.populateFields(cb);
			}, function (err) { res.send(err || photos); });
		});
	};

	// Get a single image by id.
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
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }
			photo.destroy(function (err) {
				res.send(err || 204);
			});
		});
	}

	routes.create = function create(req, res, next) {
		req.params.folder_id = 1;
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