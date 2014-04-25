(function() { 'use strict';

	var MAX_HEIGHT = 350;

	var tag = angular.module('tag', ['ngResource']);

	tag.config(function ($stateProvider) {
		$stateProvider.state('tags', {
			url: '/tags',
			templateUrl: 'views/tag/index.html',
			controller: 'TagsController'
		});

		$stateProvider.state('tag', {
			url: '/tag/{id:[0-9]{1,10}}',
			templateUrl: 'views/tag/show.html',
			controller: 'TagController'
		});
	});

	tag.controller('TagsController', function ($scope, $timeout, Tag) {
		Tag.all(function (tags) {
			$scope.tags = tags;
			$timeout(function () {
				try {
					TagCanvas.Start('tagsCanvas', undefined, {
						textColour: '#000',
						outlineColour: '#A00',
						outlineMethod: 'colour',
						textHeight: 30,
						reverse: true,
						depth: 0.5,
						initial: [0.1, -0.2]
					});
				} catch(e) {
					document.getElementById('tagsContainer').style.display = 'none';
				}
			});
		});
	});

	tag.controller('TagController', function ($scope, $stateParams, Tag) {
		$scope.tag = Tag.get({id: $stateParams.id});
	});

})();