module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord');

	var photo = {
		table: 'photo',
		belongs_to: ['folder'],
		has_many: [
			'rating',
			{what: 'tag', through: 'taglist'}
		]
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

	return new ActiveRecord(db, photo);
};