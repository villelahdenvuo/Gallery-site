
function ActiveRecord(db, model) {
	this.db = db;
	model.table = db.TABLE_PREFIX + '_' + model.table;
	this.model = model;
}

ActiveRecord.prototype.all = function(cb) {
	var self = this;
	self.db.query('SELECT * FROM ??', [self.model.table], function (err, rows, fields) {
		console.log(arguments);
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, []); }

		objects = rows.map(function (data) {
			return self.create(data);
		});

		cb(null, objects);
	});
};

ActiveRecord.prototype.findOne = function (attr, cb) {
	var self = this;
	self.db.query('SELECT * FROM ?? WHERE ? LIMIT 1', [self.model.table, attr], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, self.create(rows[0]));
	});
};


ActiveRecord.prototype.create = function (data) {
	var self = this;
	// Belongs to.
	if (Array.isArray(self.model.belongs_to)) {
		self.model.belongs_to.forEach(function (ref) {
			var name = ref[0].toUpperCase() + ref.slice(1);
			data['get' + name] = self.getReference.bind(self, data, ref);
			data['set' + name] = self.setReference.bind(self, data, ref);
		});
	}
	return data;
};

ActiveRecord.prototype.getReference = function(data, table, cb) {
	var self = this, id = data[table + '_id'];
	if (!id) {
		console.log(self.model, data, table);
		throw new Error(self.model.table + ' does not have relation with ' + table);
	}
	self.db.query('SELECT * FROM ?? WHERE id = ? LIMIT 1', [self.db.TABLE_PREFIX + table, id], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, self.create(rows[0]));
	});
};

ActiveRecord.prototype.setReference = function(table, ref) {
	if (!ref.id) {
		throw new Error('Unable to set reference to ' + JSON.stringify(ref) + ' no ID found!');
	}
	this.model[table + '_id'] = ref.id;
};

module.exports = ActiveRecord;