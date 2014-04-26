(function() { 'use strict';

	var api = angular.module('api', ['ngResource']);

	// The URL of the REST API.
	api.constant('apiUrl', 'https://secure.tuhoojabotti.com/gallery/');

	// Photo model.
	api.factory('Photo', ['$resource', 'apiUrl', function ($resource, apiUrl) {
		return $resource(apiUrl + 'photo/:id', { id: '@id' },
			{
				'get':    { method: 'GET' },
				'save':   { method: 'POST' },
				'all':    { method: 'GET', isArray: true, url: apiUrl + 'photos' },
				'delete': { method: 'DELETE' },
				'create': { method: 'PUT' }
			});
	}]);

	// Tag model.
	api.factory('Tag', ['$resource', 'apiUrl', function ($resource, apiUrl) {
		return $resource(apiUrl + 'photo/:id/tag', { id: '@id' },
			{
				'get':    { method: 'GET', url: apiUrl + 'tag/:name' },
				'save':   { method: 'POST' },
				'all':    { method: 'GET', isArray: true, url: apiUrl + 'tags' },
				'delete': { method: 'DELETE' },
				'create': { method: 'PUT' }
			});
	}]);

})();