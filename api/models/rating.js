module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord');

	var rating = {
		table: 'rating'
		//belongs_to: ['user', 'photo']
	};

	return new ActiveRecord(db, rating);
};