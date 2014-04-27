module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord')
		, async = require('async')
		, Joi = require('joi');

	var photo = {
		// Which database table has the data.
		table: 'photo',
		// photo.folder_is -> photo.getFolder()
		belongs_to: ['folder'],
		has_many: [
			// rating.photo_id -> photo.getRatingList()
			'rating',
			// taglist.photo_id and taglist.tag_id -> photo.getTagList()
			{what: 'tag', through: 'taglist'}
		],
		// Used for validation
		schema: Joi.object().keys({
			path:         Joi.string().min(3).max(255).required(),
			name:         Joi.string().min(3).max(100).required(),
			description:  Joi.string().allow('').max(200),
			width:        Joi.number().integer().min(500).max(10000).required(),
			height:       Joi.number().integer().min(500).max(10000).required(),
			folder_id:    Joi.number().integer().default(1),
			id:           Joi.number().integer().optional()
		})
	};

	// Helpers are added to instances, like photo.averageRating()
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