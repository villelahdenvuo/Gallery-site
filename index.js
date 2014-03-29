var restify = require('restify')
	, ormify = require('./lib/ormify');

// Load environment variables.
require('dotenv').load();

// Load models.
var Photo = ormify.bind(require('./models/photo'));

// Load controllers.
var controllers = {};
controllers.photos = require('./controllers/photo')(restify, Photo);

var server = restify.createServer();
server.use(restify.gzipResponse());

// Activate routes.
require('./routes')(server, controllers);

server.listen(process.env.PORT, function() {
	console.log('Server started.');
});