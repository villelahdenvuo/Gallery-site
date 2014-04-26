(function() { 'use strict';

	angular.module('photo').config(['$stateProvider', function ($sp) {

		// Index, listing all photos.
		$sp.state('photos', { url: '/',
			templateUrl: tpl('photo/index'),
			controller: 'PhotosController'
		});

		// Photo, viewing a single photo.
		$sp.state('photos.photo', { url: 'photo/{id:[0-9]{1,10}}',
			templateUrl: tpl('photo/show'),
			controller: 'PhotoController',
			onEnter: stopScroll,
			onExit: startScroll
		});

		// New, creating a new photo (modal).
		$sp.state('photos.new', {
			url: 'photo/new',
			onEnter: function ($state, $modal) {
				$modal.open({ templateUrl: 'views/photo/new.html', controller: 'NewPhotoController' })
					.result.catch($state.go.bind($state, 'photos'));
			}
		});
	}]);

	angular.module('tag').config(['$stateProvider', function ($sp) {

		// Tags index, listing all tags.
		$sp.state('tags', { url: '/tags',
			templateUrl: tpl('tag/index'),
			controller: 'TagsController'
		});

		// Tag, viewing a single tag.
		$sp.state('tag', { url: '/tag/{id:[0-9]{1,10}}',
			templateUrl: tpl('tag/show'),
			controller: 'TagController'
		});
	}]);

	// Helpers functions

	function tpl(name) { return 'views/' + name + '.html'; }

	function blockEvent(e) {
		e.preventDefault();
		e.stopPropagration();
	}

	function stopScroll() {
		angular.element(document.body)
			.addClass('modal-open')
			.on('touchmove', blockEvent);
		angular.element(document.querySelector("html"))
			.css({'overflow': 'hidden', 'height': '100%'});
	};

	function startScroll() {
		angular.element(document.body)
			.removeClass('modal-open')
			.off('touchmove', blockEvent);
		angular.element(document.querySelector("html"))
			.css({'overflow': 'auto', 'height': 'auto'});
	};

})();