var restify = require('restify');
require('dotenv').load();

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});