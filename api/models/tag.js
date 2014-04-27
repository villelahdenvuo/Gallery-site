module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord')
		, Joi = require('joi');

	var tag = {
		table: 'tag',
		has_many: [{what: 'photo', through: 'taglist'}],
		schema: Joi.object().keys({
			name: Joi.string().min(2).max(15).required(),
			id:   Joi.number().integer().optional()
		})
	};

	var helpers = tag.helpers = {};

	helpers.populatePhotos = function (cb) {
		var self = this;
		self.getPhotoList(function (err, photos) {
			if (err) { return cb(err); }
			self.photos = photos || [];
			cb(err);
		});
	};

	return new ActiveRecord(db, tag);
};