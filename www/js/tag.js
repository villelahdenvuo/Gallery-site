(function() { 'use strict';

	var tag = angular.module('tag', ['ngResource']);

	tag.controller('TagsController', function ($scope, $timeout, Tag, $templateCache) {
		// If we already made one, reset the script.
		TagCanvas.Delete('tagsCanvas');

		Tag.all(function (tags) {
			$scope.tags = tags;
			// After tags are rendered, start TagCanvas.
			$timeout(function () {
				try {
					TagCanvas.Start('tagsCanvas', 'tags', {
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
		$scope.tag = Tag.get({name: $stateParams.name});
	});

})();