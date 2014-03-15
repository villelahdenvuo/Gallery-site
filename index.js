var restify = require('restify')
	, mysql = require('mysql');

// Load environment variables.
require('dotenv').load();


var db = mysql.createConnection({
	host:     process.env.MYSQL_SERVER,
	user:     process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD
});

function respond(req, res, next) {
	db.query('SELECT ? + ? AS solution', [req.params.num1, req.params.num2], function(err, rows, fields) {
		if (err) { return next(err); }

		res.send(rows[0]);
		return next();
	});
}

var server = restify.createServer();
server.use(restify.gzipResponse());

server.get('/sum/:num1/:num2', respond);

server.listen(process.env.PORT, function() {
	console.log('%s listening at %s', server.name, server.url);
});