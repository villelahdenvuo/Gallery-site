(function() { 'use strict';

	var MAX_HEIGHT = 350;

	var photo = angular.module('photo', ['ngResource', 'contenteditable']);

	photo.controller('PhotosController', function ($scope, $timeout, Photo) {

		// Update layout on search.
		$scope.$watch('search', $timeout.bind(null, layout));

		$scope.photos = Photo.all();
	});

	photo.controller('NewPhotoController', ['$scope', '$state', 'Photo',
	function ($scope, $state, Photo) {
		$scope.photo = {};

		$scope.submit = function () {
			Photo.create($scope.photo, function () {
				$scope.$close();
				$state.go('photos', {}, { reload: true });
			}, function (res) {
				if (res.status === 400) {
					$scope.errors = res.data.message;
					$scope.error = {};
					$scope.errors.forEach(function (a) { $scope.error[a.split(' ')[0]] = 'error'; });
				}
			});
		}
	}]);

	photo.controller('PhotoController',
	function ($http, apiUrl, $state, $stateParams, $scope, Photo, Tag, $filter) {
		$scope.editing = 'fa-edit';

		$scope.photo = Photo.get({ id: $stateParams.id }, angular.noop, function (res) {
			$scope.error = res.data;
			$scope.error.status = res.status;
			$scope.photo.name = res.data.code;
			$scope.photo.description = res.data.message;
		});

		$scope.edit = function () {
			if ($scope.editing === 'fa-edit') {
				$scope.editing = 'fa-save';
			} else {
				$scope.photo.description = cleanString($scope.photo.description);
				$scope.photo.name = cleanString($scope.photo.name);
				$scope.photo.$save(function () {
					$scope.editing = 'fa-edit';
				});
			}
		};

		$scope.keydown = function ($event) {
			if ($event.which !== 13) { return; }
			// On enter, save changes.
			$scope.edit();
			$scope.editing = 'fa-edit';
		};

		// $scope.destroy binds directly to $scope.photo.delete.
		$scope.destroy = $scope.photo.$delete.bind($scope.photo,
			$state.go.bind($state, 'photos', {}, { reload: true }));

		// Save the rating.
		$scope.rate = function ($event) {
			var elem = angular.element($event.target)
				.parent().parent().removeClass('saved');

			$http.put(apiUrl + '/rating', { photo_id: $scope.photo.id, score: $scope.photo.rating })
				.success(elem.addClass.bind(elem, 'saved'));
		};

		// Load tags and filter them by query (for tag input).
		$scope.loadTags = function (query) {
			return Tag.all().$promise.then(function (tags) {
				return $filter('filter')(tags, {name: query});
			});
		};

		$scope.saveTag = function ($tag) {
			Tag.create({id: $scope.photo.id}, {name: $tag.name});
		};

		$scope.removeTag = function ($tag) {
			Tag.delete({id: $scope.photo.id, name: $tag.name});
		};
	});

	photo.directive('runLayout', function ($timeout) {
		return function($scope, element, attrs) {
			element.find('img').on('load', function () {
				angular.element(this).removeClass('hidden');
			});
			// All images rendered, do layout.
			if ($scope.$last) { $timeout(layout); }
		}
	});

	function cleanString(str) {
		if (!str) { return ''; }
		return S(str).stripTags().decodeHTMLEntities().collapseWhitespace().s;
	}

	function getheight(images, width) {
		width -= images.length * 5;
		var h = 0;
		for (var i = 0; i < images.length; ++i) {
			h += images[i].dataset.width / images[i].dataset.height;
		}
		return width / h;
	}

	function setheight(images, height) {
		for (var i = 0; i < images.length; ++i) {
			var img = images[i];
			img.style.width = height * img.dataset.width / img.dataset.height + 'px';
			img.style.height = height + 'px';
			// Load smaller image.
			//$(images[i]).attr('src', $(images[i]).attr('src')
			//.replace(/w[0-9]+-h[0-9]+/, 'w' + $(images[i]).width() + '-h' + $(images[i]).height()));
		}
	}

	function layout() {
		var size = window.innerWidth - 15;
		var images = [].slice.call(document.querySelectorAll('.photos-container img'));
		w: while (images.length > 0) {
			for (var i = 1; i < images.length + 1; ++i) {
				var slice = images.slice(0, i);
				var h = getheight(slice, size);
				if (h < MAX_HEIGHT) {
					setheight(slice, h);
					images = images.slice(i);
					continue w;
				}
			}
			setheight(slice, Math.min(MAX_HEIGHT, h));
			break;
		}
	}

	window.addEventListener('resize', layout);
})();