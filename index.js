var restify = require('restify')
	, request = require('request')
	, mysql = require('mysql');

// Load environment variables.
require('dotenv').load();

// Open Database connection.
var db = mysql.createPool({
	host:     process.env.MYSQL_SERVER,
	user:     process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE
});

db.TABLE_PREFIX = process.env.MYSQL_TABLE_PREFIX;

// Load models.
var Photo = require('./models/photo')(db);

// Load controllers.
var controllers = {};
controllers.photos = require('./controllers/photo')(restify, Photo);

// Start server.
restify.CORS.ALLOW_HEADERS.push('x-accesstoken');
var server = restify.createServer();
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.fullResponse());

// Activate routes.
require('./routes')(server, controllers);

function validateToken(req, res, next) {
	if (!req.headers['x-accesstoken']) {
		return next(new restify.UnauthorizedError("Invalid Access Token"));
	}
	request('https://graph.facebook.com/me?access_token=' + req.headers['x-accesstoken'],
	function (err, res, body) {
	  if (err) { return next(err); }
	  console.log('USER:', JSON.parse(body));
	  next();
	})
}

server.post('/login', validateToken, function (req, res) {
	res.send(200);
});

server.listen(process.env.PORT, function() {
	console.log('Server started.');
});