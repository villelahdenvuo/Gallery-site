module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord');

	var tagref = {
		table: 'taglist',
		belongs_to: ['photo', 'tag']
	};

	return new ActiveRecord(db, tagref);
};