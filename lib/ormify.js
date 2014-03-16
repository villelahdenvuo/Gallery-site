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

  var services = ['findOne', 'create', 'all'];

  services.forEach(function (service) {
  	object[service] = self[service].bind(self, object);
  });

  return object;
};

Ormify.prototype.findOne = function(object, attributes, cb) {
	var self = this;
	self.pool.query('SELECT * FROM ?? WHERE ?;', [object.table, attributes], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, self.create(object, rows[0]));
	});
};

Ormify.prototype.all = function(object, cb) {
	var self = this;
	self.pool.query('SELECT * FROM ??;', [object.table], function (err, rows, fields) {
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, []); }

		objects = rows.map(function (data) {
			return self.create(object, data);
		});

		cb(null, objects);
	});
};

Ormify.prototype.create = function(object, data) {
/*	var self = this, instance = {};
	// Populate instance with data and getters.
	Object.keys(data).forEach(function (key) {
		var type = object.schema[key].split(':')[0];
		switch (type) {
			case 'string':
			case 'number':
			  instance[key] = data[key];
				break;
			case 'ref':
				var name = key.split(':')[1];
				instance[name] = self.getReference.bind(self, name, data[key]);
				break;
			default:
				throw new Error('Undefined schema for ' + type + ' on ' + object.name);
		}
	});*/
	return data;
};

function className(obj) {
	var type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
	if (type === 'number') { return isNaN(obj) ? 'nan' : 'number'; }
	return type;
}

module.exports = new Ormify();