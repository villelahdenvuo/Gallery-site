module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord');

	var tag = {
		table: 'tag',
		has_many: [{what: 'photo', through: 'taglist'}]
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