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
	var Photo  = require('./models/photo')(db);
	var User   = require('./models/user')(db);
	var Rating = require('./models/rating')(db);
	var Tag    = require('./models/tag')(db);
	var TagReference = require('./models/tag-reference')(db);

	// Load controllers.
	var controllers = {};
	controllers.photos  = require('./controllers/photo')(restify, Photo);
	controllers.users   = require('./controllers/user')(restify, request, User);
	controllers.ratings = require('./controllers/rating')(restify, Rating);
	controllers.tags    = require('./controllers/tag')(restify, Tag, Photo, TagReference);

	// Load helpers.
	var helper = require('./lib/helpers');

	// Allow authorization header in CORS.
	restify.CORS.ALLOW_HEADERS.push('authorization');

	// Start server.
	var server = restify.createServer();
	server.use(restify.gzipResponse());
	server.use(restify.bodyParser());
	server.use(restify.queryParser());
	server.use(restify.CORS());
	server.use(restify.fullResponse());
	server.use(helper.respondToSave);

	// Authentivation middleware.
	var verify = require('./lib/accesstoken')(restify, request, User);

	// Activate routes.
	require('./routes')(server, controllers, verify);

	server.listen(process.env.PORT, function() {
		console.log('Server started.');
	});
};