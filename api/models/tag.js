module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord');

	var tag = {
		table: 'tag',
		has_many: [{what: 'photo', through: 'taglist'}]
	};

	return new ActiveRecord(db, tag);
};