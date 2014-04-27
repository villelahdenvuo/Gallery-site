module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord')
		, async = require('async')
		, Joi = require('joi');

	var photo = {
		table: 'photo',
		belongs_to: ['folder'],
		has_many: [
			'rating',
			{what: 'tag', through: 'taglist'}
		],
		schema: Joi.object().keys({
			path: 				Joi.string().min(3).max(255).required(),
			name: 				Joi.string().min(3).max(30).required(),
			description: 	Joi.string().min(3).max(1000).optional(),
			width: 				Joi.number().integer().min(500).max(10000).required(),
			height: 			Joi.number().integer().min(500).max(10000).required(),
			folder_id: 		Joi.number().integer().optional()
		})
	};

	var helpers = photo.helpers = {};

	helpers.averageRating = function (cb) {
		this.getRatingList(function (err, ratings) {
			if (!ratings) { return cb(null, { average: 0, count: 0 }); }
			var avg = ratings.reduce(function (prev, cur) {
				return prev + cur.score;
			}, 0) / ratings.length;
			cb(err, { average: avg, count: ratings.length });
		});
	};

	helpers.populateFields = async.applyEach([populateRating, populateTags]);

	function populateRating(cb) {
		var self = this;
		self.averageRating(function (err, rating) {
			if (err) { return cb(err); }
			if (!rating) { return cb(err, photo); }
			self.rating = rating.average;
			self.ratingCount = rating.count;
			cb(err);
		});
	}

	function populateTags(cb) {
		var self = this;
		self.getTagList(function (err, tags) {
			if (err) { return cb(err); }
			self.tags = tags || [];
			cb(err);
		});
	}

	return new ActiveRecord(db, photo);
};