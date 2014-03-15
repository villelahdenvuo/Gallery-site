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
  if (!object || !object.schema) {
  	throw new Error('Missing shcema on ' + object);
  }
  var self = this;
  // Add this to every schema.
  object.schema.id = 'number';

  object.findOne = self.findOne.bind(self, object);
  object.create = self.create.bind(self, object);
  return object;
};

Ormify.prototype.findOne = function(object, id, cb) {
	//console.log(arguments);
	var self = this;
	self.pool.query('SELECT * FROM ?? WHERE id = ?;', [prefix + object.table, id], function (err, rows, fields) {
		console.log(arguments);
		if (err) { return cb(err); }
		if (!rows.length) { return cb(null, null); }
		cb(null, self.create(object, rows[0]));
	});
};

Ormify.prototype.create = function(object, data) {
	var self = this, instance = {};
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
	});
	return instance;
};

Ormify.prototype.getReference = function(table, id, cb) {
	cb(null, 'not implemented yet');
};

function className(obj) {
	var type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
	if (type === 'number') { return isNaN(obj) ? 'nan' : 'number'; }
	return type;
}

function combine(rows, columns) {
	return rows.map(function(row) {
	  return row.reduce(function(result, field, index) {
	    return result[columns[index]] = field;
	  }, {});
	});
}

module.exports = Ormify;