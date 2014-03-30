	var restify = require('restify')
		, request = require('request')
		, mysql = require('mysql');

require('./api')(restify, request, mysql);