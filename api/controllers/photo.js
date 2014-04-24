module.exports = function (restify, Photo) {
	var async = require('async');
	var routes = {};

	function populateRating(photo, cb) {
		photo.averageRating(function (err, rating) {
			if (err) { return cb(err); }
			if (!rating) { return cb(err, photo); }
			photo.rating = rating.average;
			photo.ratingCount = rating.count;
			cb(err);
		});
	}

	function populateTags(photo, cb) {
		photo.getTagList(function (err, tags) {
			if (err) { return cb(err); }
			photo.tags = tags || [];
			cb(err);
		});
	}

	var populateFields = async.applyEach([populateRating, populateTags]);

	// List all photos.
	routes.index = function index(req, res) {
		Photo.all(function (err, photos) {
			if (err) { return next(err); }

			async.map(photos, populateFields,
				function (err) { res.send(err || photos); });

		});
	};

	// Get a single image by id.
	routes.show = function show(req, res, next) {
		Photo.findOne({id: req.params.id}, function (err, photo) {
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }

			populateFields(photo, function (err) { res.send(err || photo); });

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

	routes.save = function save(req, res, next) {
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