module.exports = function (restify, Photo) {
	var routes = {};

	// List all photos.
	routes.index = function (req, res) {
		Photo.all(function (err, photos) {
			res.send(err || photos);
		});
	};

	// Get a single image by id.
	routes.show = function (req, res, next) {
		// TODO: validate id as Number.
		Photo.findOne({id: req.params.id}, function (err, photo) {
			if (!photo) { return next(new restify.NotFoundError('Requested photo not found.')); }
			// Populate folder.
			photo.getFolder(function (err, folder) {
				photo.folder = folder;
				res.send(photo);
			});
		});
	}

	return routes;
};