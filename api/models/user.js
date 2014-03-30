module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord');

	var user = {
		table: 'user'
		//has_many: ['rating']
	};

	return new ActiveRecord(db, user);
};