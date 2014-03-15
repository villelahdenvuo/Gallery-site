var restify = require('restify')
	, ormify = new (require('./lib/orm'))();

var Photo = ormify.bind(require('./models/photo'));

// Load environment variables.
require('dotenv').load();

/*function respond(req, res, next) {
	db.query('SELECT ? + ? AS solution', [req.params.num1, req.params.num2], function(err, rows, fields) {
		if (err) { return next(err); }

		res.send(rows[0]);
		return next();
	});
}*/

var server = restify.createServer();
server.use(restify.gzipResponse());

//server.get('/sum/:num1/:num2', respond);

server.get('/photo/:id', function (req, res, next) {
	Photo.findOne(req.params.id, function (err, photo) {
		res.send(photo);
	});
});

server.listen(process.env.PORT, function() {
	console.log('%s listening at %s', server.name, server.url);
});