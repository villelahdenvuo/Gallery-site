module.exports = function (restify, Photo) {
	var async = require('async');
	var routes = {};

	// List all photos.
	routes.index = function (req, res) {
		Photo.all(function (err, photos) {
			if (err) { return next(err); }

			async.map(photos, function (photo, cb) {
				photo.populateFields(cb);
			}, function (err) { res.send(err || photos); });
		});
	};

	// Get a single image by id.
	routes.show = function (req, res, next) {
		Photo.findOne({id: req.params.id}, function (err, photo) {
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }

			photo.populateFields(function (err) {
				res.send(err || photo);
			});
		});
	};

	routes.destroy = function (req, res, next) {
		Photo.findOne({id: req.params.id}, function (err, photo) {
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }
			photo.destroy(function (err) {
				res.send(err || 204);
			});
		});
	}

	routes.create = function (req, res, next) {
		var data = {
			path: req.params.url,
			name: req.params.name,
			description: req.params.description,
			width: req.params.width,
			height: req.params.height,
			folder_id: 1
		};

		photo = Photo.create(data);
		photo.save(function (err) {
			res.send(err || 204);
		});
	}

	routes.save = function (req, res, next) {
		Photo.findOne({id: req.params.id}, function (err, photo) {
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }
			console.log(photo, req.params);
			photo.name = req.params.name;
			photo.description = req.params.description;
			photo.save(function (err) {
				res.send(err || 204);
			});
		});
	}

	return routes;
};