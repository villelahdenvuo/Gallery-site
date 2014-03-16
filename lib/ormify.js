var mysql = require('mysql');
require('dotenv').load();

var prefix = process.env.MYSQL_TABLE_PREFIX + '_';

function Ormify() {
	this.pool = mysql.createPool({
		host:     process.env.MYSQL_SERVER,
		user:     process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE
	});
}

Ormify.prototype.bind = function(object) {
  if (!object || !object.table) {
  	throw new Error('Table not defined ' + object);
  }
  var self = this;
  object.table = prefix + object.table;

  // These services are added to the ormified object.
  var services = ['findOne', 'create', 'all'];

  services.forEach(function (service) {
  	object[service] = self[service].bind(self, object);
  });

  return object;
};

Ormify.prototype.findOne = function(object, attributes, cb) {
	var self = this;
	self.pool.query('SELECT * FROM ?? WHERE ? LIMIT 1', [object.table, attributes], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, self.create(object, rows[0]));
	});
};

Ormify.prototype.all = function(object, cb) {
	var self = this;
	self.pool.query('SELECT * FROM ??', [object.table], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, []); }

		objects = rows.map(function (data) {
			return self.create(object, data);
		});

		cb(null, objects);
	});
};

Ormify.prototype.create = function(object, data) {
	var self = this;
	// Belongs to.
	if (Array.isArray(object.belongs_to)) {
		object.belongs_to.forEach(function (ref) {
			var name = ref[0].toUpperCase() + ref.slice(1);
			data['get' + name] = self.getReference.bind(self, data, ref);
			data['set' + name] = self.setReference.bind(self, data, ref);
		});
	}
	return data;
};

Ormify.prototype.getReference = function(object, table, cb) {
	var self = this, id = object[table + '_id'];
	if (!id) {
		console.log(object, table);
		throw new Error('Object does not have relation with ' + table);
	}
	self.pool.query('SELECT * FROM ?? WHERE id = ? LIMIT 1', [prefix + table, id], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, self.create(object, rows[0]));
	});
};

Ormify.prototype.setReference = function(object, table, ref) {
	if (!ref.id) {
		throw new Error('Unable to set reference to ' + JSON.stringify(ref) + ' no ID found!');
	}
	object[table + '_id'] = ref.id;
};

function className(obj) {
	var type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
	if (type === 'number') { return isNaN(obj) ? 'nan' : 'number'; }
	return type;
}

module.exports = new Ormify();