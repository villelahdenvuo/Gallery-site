(function() { 'use strict';

	var tag = angular.module('tag', ['ngResource']);

	tag.controller('TagsController', function ($scope, $timeout, Tag) {
		Tag.all(function (tags) {
			$scope.tags = tags;
			// After tags are rendered, start TagCanvas.
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
			}, 200);
		});
	});

	tag.controller('TagController', function ($scope, $stateParams, Tag) {
		$scope.tag = Tag.get({name: $stateParams.name});
	});

})();