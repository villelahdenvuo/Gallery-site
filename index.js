var restify = require('restify')
	, ormify = require('./lib/ormify');

// Load models.
var Photo = ormify.bind(require('./models/photo'));

// Load routes.
var photos = require('./routes/photo')(restify, Photo);

// Load environment variables.
require('dotenv').load();

var server = restify.createServer();
server.use(restify.gzipResponse());

server.get('/photos',    photos.index);
server.get('/photo/:id', photos.show);

server.listen(process.env.PORT, function() {
	console.log('Server started.');
});