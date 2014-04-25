module.exports = function (restify, Tag) {
	var async = require('async');
	var routes = {};

	// List all tags.
	routes.index = function index(req, res) {
		Tag.all(function (err, tags) {
			res.send(err || tags);
		});
	};

	routes.show = function index(req, res) {
		Tag.findOne({id: req.params.id}, function (err, tag) {
			if (!tag) { return next(new restify.NotFoundError('Requested photo not found.')); }

			tag.populatePhotos(function (err) {
				res.send(err || tag);
			});
		});
	};

	return routes;
};