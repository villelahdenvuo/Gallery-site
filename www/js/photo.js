(function() {
  'use strict';

  var MAX_HEIGHT = 350;

  var photo = angular.module('photo', ['ngResource', 'ngAnimate', 'contenteditable']);

  photo.run(function  ($templateCache, $http) {
    // Preload show template.
    $http.get('views/photo/show.html', { cache: $templateCache });
  });

  photo.factory('Photo', ['$resource', 'apiUrl', function ($resource, apiUrl) {
    return $resource(apiUrl + 'photo/:id', { id:'@id' },
      {
        'get':    { method: 'GET' },
        'save':   { method: 'POST' },
        'all':    { method: 'GET', isArray: true, url: apiUrl + 'photos' },
        'delete': { method: 'DELETE' },
        'create': { method: 'PUT' }
      });
  }])

  photo.config(function ($stateProvider) {
    $stateProvider.state("photos", {
      url: '/',
      templateUrl: "views/photo/index.html",
      controller: 'PhotosController'
    });

    $stateProvider.state('photos.photo', {
      url: 'photo/{id:[0-9]{1,10}}',
      templateUrl: 'views/photo/show.html',
      controller: 'PhotoController',
      controllerAs: 'Photo',
      onEnter: stopScroll,
      onExit: startScroll
    });

    $stateProvider.state('photos.new', {
      url: 'photo/new',
      onEnter: function($log, $state, $modal) {
        $log.debug('showing new photo modal');
        $modal.open({
          templateUrl: 'views/photo/new.html',
          windowClass: 'new-photo',
          controller: ['$scope', 'Photo', function ($scope, Photo) {
            $scope.photo = {};

            $scope.submit = function () {
              Photo.create($scope.photo, function () {
                $scope.$close();
                $state.go('photos', {}, { reload: true });
              });
            }
          }]
        }).result.catch(function () {
          $log.debug('new photo modal dismissed');
          $state.go('photos');
        });
      }
    });
  });

  photo.controller('PhotosController', function ($scope, Photo) {
    $scope.photos = Photo.all();
  });

  photo.controller('PhotoController', function ($log, $state, $stateParams, $scope, Photo) {
    $scope.editing = 'fa-edit';
    $scope.error = false;

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
          $log.debug('changes saved');
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

    $scope.destroy = function () {
      $scope.photo.$delete(function () {
        $log.info('deleted photo', $scope.photo);
        $state.go('photos', {}, { reload: true });
      });
    };
  });

  photo.directive('runLayout', function ($timeout) {
    return function(scope, element, attrs) {
      element.find('img').on('load', function () {
        //console.log(this);
        angular.element(this).removeClass('hidden');
      });

      if (scope.$last) {
        // Do after rendering.
        $timeout(function () {
          layout(MAX_HEIGHT);
        });
      }
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

  function layout(max_height) {
    var size = window.innerWidth - 15;
    var n = 0;
    var images = [].slice.call(document.querySelectorAll('.photos-container img'));
    w: while (images.length > 0) {
      for (var i = 1; i < images.length + 1; ++i) {
        var slice = images.slice(0, i);
        var h = getheight(slice, size);
        if (h < max_height) {
          setheight(slice, h);
          n++;
          images = images.slice(i);
          continue w;
        }
      }
      setheight(slice, Math.min(max_height, h));
      n++;
      break;
    }
  }

  function stopScroll() {
    angular.element(document.body).addClass('modal-open');
  }

  function startScroll() {
    angular.element(document.body).removeClass('modal-open');
  }

  window.addEventListener('resize', function () { layout(MAX_HEIGHT); });
})();