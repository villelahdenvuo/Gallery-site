var S = require('string')
	, clone = require('clone')
	, Joi = require('joi');

/** Custom ActiveRecord implementation.
 * db - a database connection (pool)
 * model - a model object (see models folder for examples)
 */
function ActiveRecord(db, model) {
	console.log('Creating AR for', model)
	this.db = db;
	model.name = model.table;
	model.table = db.TABLE_PREFIX + '_' + model.table;
	this.model = model;
}

/** Return all items from database. */
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

/** Find one item from database. */
ActiveRecord.prototype.findOne = function (attr, cb) {
	var self = this;
	attr = Object.keys(attr).map(function (a) {
		return "`" + a + "` = " + self.db.escape(attr[a]);
	}).join(' AND ');

	self.db.query('SELECT * FROM ?? WHERE ' + attr + ' LIMIT 1', [self.model.table, attr], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, create.call(self, false, rows[0]));
	});
};

/** Find one item, or create it if it doesn't exist yet. */
ActiveRecord.prototype.findOrCreate = function(attr, cb) {
	var self = this;
	self.findOne(attr, function (err, obj) {
		if (!obj) {
			self.db.query('INSERT INTO ?? SET ?', [self.model.table, attr], function (err, result) {
				if (err) { return cb(err); }
				attr.id = result.insertId;
				cb(null, create.call(self, false, attr));
			});
		} else {
			cb(err, obj);
		}
	})
};

/** Create a new instance (use instance.save() to persist it). */
ActiveRecord.prototype.create = function (data) {
	return create.call(this, true, data || {});
};

// PRIVATE

// Build instances from data (add helpers and other methods).
function create(isNew, data) {
	var self = this, props = {};
	// Belongs to.
	if (Array.isArray(self.model.belongs_to)) {
		self.model.belongs_to.forEach(function (ref) {
			var name = S(ref).capitalize().s;
			props['get' + name] = { value: getOwnReference.bind(self, data, ref) };
			props['set' + name] = { value: setOwnReference.bind(self, data, ref) };
		});
	}

	// Has many.
	if (Array.isArray(self.model.has_many)) {
		self.model.has_many.forEach(function (ref) {
			if (typeof ref === 'string') {
				var name = S(ref).capitalize().s;
				props['get' + name + 'List'] = { value: getForeignReference.bind(self, data, ref) };
			} else if (typeof ref === 'object') {
				var name = S(ref.what).capitalize().s;
				props['get' + name + 'List'] = { value: getForeignReferenceThrough.bind(self, data, ref) };
			}
		});
	}

	// Persist method.
	props.save = { value: persist.bind(self, data, isNew) };

	if (!isNew) {
		props.destroy = { value: destroy.bind(self, data) };
	} else {
		props.destroy = { value: noop };
	}

	// Helpers
	if (self.model.helpers) {
		Object.keys(self.model.helpers).forEach(function (name) {
			props[name] = { value: self.model.helpers[name].bind(data) };
		});
	}

	return Object.defineProperties(data, props);
}

function noop(cb) { cb(null); }

/** Delete from database by id. */
function destroy(data, cb) {
	this.db.query('DELETE FROM ?? WHERE ? LIMIT 1', [this.model.table, { id: data.id }], cb);
}

/** Save to database, first validate if schema is provided. */
function persist(data, isNew, cb) {
	var self = this, copy = clone(data);

	// Validate data.
	if (self.model.schema) {
		Joi.validate(data, self.model.schema, {
			abortEarly: false
		}, function (err, value) {
			if (err) {
				err.message = err.message.split('. ');
				return cb(err, false);
			}
			insertOrUpdate();
		});
	} else { insertOrUpdate(); }

	function insertOrUpdate() {
		if (isNew) {
			self.db.query('INSERT INTO ?? SET ?', [self.model.table, data], function (err, result) {
				if (err) { return cb(err, true); }
				data.id = result.insertId;
				cb(null, true);
			});
		} else {
			var id = copy.id;
			// Let's not update the id.
			delete copy.id;
			self.db.query('UPDATE ?? SET ? WHERE id = ?', [self.model.table, copy, id], function (err, rows, fields) {
				cb(err, true);
			});
		}
	}
}

// Belongs to -helper
function getOwnReference(data, table, cb) {
	var self = this, id = data[table + '_id'];
	if (!id) {
		console.log(self.model, data, table);
		throw new Error(self.model.table + ' does not have relation with ' + table);
	}
	self.db.query('SELECT * FROM ?? WHERE id = ? LIMIT 1', [self.db.TABLE_PREFIX + '_' + table, id], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, create.call(self, false, rows[0]));
	});
}

// Belongs to -helper
function setOwnReference(data, table, ref) {
	if (!ref.id) {
		throw new Error('Unable to set reference to ' + JSON.stringify(ref) + ' no ID found!');
	}
	data[table + '_id'] = ref.id;
}

// Has many -helper
function getForeignReference(data, table, cb) {
	var self = this;
	if (!data.id) {
		console.log(self.model, data, table);
		throw new Error(self.model.table + ' does not have relation with ' + table);
	}
	self.db.query('SELECT * FROM ?? WHERE ?? = ?', [self.db.TABLE_PREFIX + '_' + table, self.model.name + '_id', data.id], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }

		objects = rows.map(function (data) {
			return create.call(self, false, data);
		});

		cb(null, objects);
	});
}

// Has many through -helper
function getForeignReferenceThrough(data, ref, cb) {
	var self = this, p = self.db.TABLE_PREFIX + '_';
	if (!data.id) {
		console.log(self.model, data, table);
		throw new Error(self.model.table + ' does not have relation with ' + table);
	}
	self.db.query('SELECT * FROM ?? a WHERE a.id IN (SELECT ?? FROM ?? b WHERE ?? = ?)',
		[p + ref.what, ref.what + '_id', p + ref.through, 'b.' + self.model.name + '_id', data.id],
	function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }

		objects = rows.map(function (data) {
			return create.call(self, false, data);
		});

		cb(null, objects);
	});
}

module.exports = ActiveRecord;