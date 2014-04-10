module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord');

	var photo = {
		table: 'photo',
		belongs_to: ['folder'],
		has_many: ['rating']
	};

	var helpers = photo.helpers = {};

	helpers.averageRating = function (cb) {
		this.getRatingList(function (err, ratings) {
			if (!ratings) { return cb(null, null); }
			cb(err, ratings.reduce(function (prev, cur) {
				return prev + cur.score;
			}, 0) / ratings.length);
		});
	};

	return new ActiveRecord(db, photo);
};