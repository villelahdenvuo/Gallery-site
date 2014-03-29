var ActiveRecord = require('../lib/activerecord');

var photo = {
	table: 'photo',
	belongs_to: ['folder']
	//has_many: ['tags']
};

module.exports = function (db) {
	return new ActiveRecord(db, photo);
};