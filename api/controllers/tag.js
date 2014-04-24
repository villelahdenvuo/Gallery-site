module.exports = function (restify, Tag) {
	var async = require('async');
	var routes = {};

	// List all tags.
	routes.index = function index(req, res) {
		Tag.all(function (err, tags) {
			res.send(err || tags);
		});
	};

	return routes;
};