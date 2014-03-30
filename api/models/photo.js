module.exports = function (db) {
	var ActiveRecord = require('../lib/activerecord');

	var photo = {
		table: 'photo',
		belongs_to: ['folder']
		//has_many: ['tags']
	};

	return new ActiveRecord(db, photo);
};