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

	tag.controller('TagController', function ($scope, $state, $stateParams, Tag) {
		$scope.tag = Tag.get({name: $stateParams.name});

		$scope.editing = 'fa-edit';

		$scope.edit = function () {
			if ($scope.editing === 'fa-edit') {
				$scope.editing = 'fa-save';
			} else {
				$scope.tag.description = cleanString($scope.tag.description);
				$scope.tag.name = cleanString($scope.tag.name);
				$scope.tag.$save(function () {
					$scope.editing = 'fa-edit';
					$scope.nameError = false;
					$state.go($state.current, { name: $scope.tag.name });
				}, function (res) {
					$scope.editing = 'fa-save';
					if (res.status === 400) {
						$scope.nameError = res.data.message[0];
					}
				});
			}
		};

		$scope.keydown = function ($event) {
			if ($event.which !== 13) { return; }
			// On enter, save changes.
			$scope.edit();
			$scope.editing = 'fa-edit';
			$event.preventDefault();
		};

		// $scope.destroy binds directly to $scope.tag.delete.
		$scope.destroy = function () {
			$scope.tag.$delete(function () {
				$state.go('tags', {}, { reload: true });
			});
		};
/*		$scope.destroy = $scope.tag.$delete.bind($scope.tag,
			$state.go.bind($state, 'tags', {}, { reload: true }));*/
	});

	function cleanString(str) {
		if (!str) { return ''; }
		return S(str).stripTags().decodeHTMLEntities().collapseWhitespace().s;
	}

})();