var S = require('string');

function ActiveRecord(db, model) {
	console.log('Creating AR for', model)
	this.db = db;
	model.table = db.TABLE_PREFIX + '_' + model.table;
	this.model = model;
}

ActiveRecord.prototype.all = function(cb) {
	var self = this;
	self.db.query('SELECT * FROM ??', [self.model.table], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, []); }

		objects = rows.map(function (data) {
			return create.call(self, false, data);
		});

		cb(null, objects);
	});
};

ActiveRecord.prototype.findOne = function (attr, cb) {
	var self = this;
	self.db.query('SELECT * FROM ?? WHERE ? LIMIT 1', [self.model.table, attr], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, create.call(self, false, rows[0]));
	});
};

ActiveRecord.prototype.findOrCreate = function(attr, cb) {
	var self = this;
	self.findOne({ id: attr.id }, function (err, obj) {
		if (!obj) {
			self.db.query('INSERT INTO ?? SET ?', [self.model.table, attr], function (err) {
				if (err) { return cb(err); }
				cb(null, create.call(self, false, attr));
			});
		} else {
			cb(err, obj);
		}
	})
};

ActiveRecord.prototype.create = function (data) {
	return create.call(this, true, data);
};

function create(isNew, data) {
	var self = this, props = {};
	// Belongs to.
	if (Array.isArray(self.model.belongs_to)) {
		self.model.belongs_to.forEach(function (ref) {
			var name = S(ref).capitalize().s;
			props['get' + name] = { value: getReference.bind(self, data, ref) };
			props['set' + name] = { value: setReference.bind(self, data, ref) };
		});
	}

	// Persist method.
	props.save = { value: persist.bind(self, data, isNew) };

	return Object.defineProperties(data, props);
}

function persist(data, isNew, cb) {
	var self = this, clone = Object.create(data);
	if (isNew) {
		self.db.query('INSERT INTO ?? SET ?', [self.model.table, data], function (err, rows, fields) {
			console.log(arguments);
		});
	} else {
		var id = clone.id;
		delete clone.id;
		self.db.query('UPDATE ?? SET ? WHERE id = ?', [self.model.table, clone, id], function (err, rows, fields) {
			console.log(arguments);
		});
	}
}

function getReference(data, table, cb) {
	var self = this, id = data[table + '_id'];
	if (!id) {
		console.log(self.model, data, table);
		throw new Error(self.model.table + ' does not have relation with ' + table);
	}
	self.db.query('SELECT * FROM ?? WHERE id = ? LIMIT 1', [self.db.TABLE_PREFIX + table, id], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, create.call(self, false, rows[0]));
	});
}

function setReference(table, ref) {
	if (!ref.id) {
		throw new Error('Unable to set reference to ' + JSON.stringify(ref) + ' no ID found!');
	}
	this.model[table + '_id'] = ref.id;
}

module.exports = ActiveRecord;