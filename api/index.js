module.exports = function (restify, request, mysql) {
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
	var User  = require('./models/user')(db);

	// Load controllers.
	var controllers = {};
	controllers.photos = require('./controllers/photo')(restify, Photo);
	controllers.users  = require('./controllers/user')(restify, request, User);

	// Start server.
	restify.CORS.ALLOW_HEADERS.push('authorization');
	var server = restify.createServer();
	server.use(restify.gzipResponse());
	server.use(restify.bodyParser());
	server.use(restify.CORS());
	server.use(restify.fullResponse());

	// Authentivation middleware.
	var verify = require('./lib/accesstoken')(restify, request, User);

	// Activate routes.
	require('./routes')(server, controllers, verify);

	// LOGIN TEST
	/*var handleAccessToken = require('./lib/accesstoken')(restify, request, User);
	server.post('/login', handleAccessToken, function (req, res) {
		console.log('logged', req.user);
		res.send(200);
	});*/

	server.listen(process.env.PORT, function() {
		console.log('Server started.');
	});
};