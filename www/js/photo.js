(function() {
  'use strict';

  var MAX_HEIGHT = 350;

  var photo = angular.module('photo', ['ngResource', 'ngAnimate', 'contenteditable']);

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
    $stateProvider.state('home.photo', {
      url: 'photo/{id:[0-9]{1,10}}',
      onEnter: function($log, $state, $modal) {
        $log.debug('showing photo modal');
        $modal.open({
          templateUrl: 'photo.html',
          windowClass: 'photo',
          controller: ['$stateParams', '$scope', 'Photo', function ($stateParams, $scope, Photo) {
            $scope.editing = 'fa-edit';

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

            $scope.photo = Photo.get({ id: $stateParams.id });
          }]
        }).result.catch(function () {
          $log.debug('login modal dissmissed');
          $state.go('home');
        });
      }
    });

    $stateProvider.state('home.new', {
      url: 'photo/new',
      onEnter: function($log, $state, $modal) {
        $log.debug('showing new photo modal');
        $modal.open({
          templateUrl: 'new-photo.html',
          windowClass: 'photo',
          controller: ['$stateParams', '$scope', 'Photo', function ($stateParams, $scope, Photo) {
            $scope.photo = {};

            $scope.submit = function () {
              Photo.create($scope.photo, function () {
                $scope.$close();
                $state.go('home');
              });
            }
          }]
        }).result.catch(function () {
          $log.debug('login modal dissmissed');
          $state.go('home');
        });
      }
    });
  });

  photo.controller('PhotoController', function (apiUrl, $timeout, $log, $scope, Photo) {
    $scope.photos = Photo.all();

    $scope.destroy = function ($event, photo) {
      angular.element($event.target).parent().addClass('delete');
      photo.$delete(function (value, responseHeaders) {
        $log.info('deleted photo', photo, $scope.photos.indexOf(photo));
        $scope.photos.splice($scope.photos.indexOf(photo), 1);
        $timeout(layout.bind(null, MAX_HEIGHT), 350);
      });
    };

    $scope.show = function (photo) {

    };

    $scope.$on('event:auth-loginCancelled', function () {
      angular.element(document.querySelector('.thumb.delete')).removeClass('delete');
    });

  });

  photo.directive('runLayout', function ($timeout) {
    return function(scope, element, attrs) {
      if (scope.$last) {
        // Do after rendering.
        $timeout(function () {
          layout(MAX_HEIGHT);
        });
      }
    }
  });

  function cleanString(str) {
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
      //$(images[i]).attr('src', $(images[i]).attr('src').replace(/w[0-9]+-h[0-9]+/, 'w' + $(images[i]).width() + '-h' + $(images[i]).height()));
    }
  }

  function resize(images, width) {
    setheight(images, getheight(images, width));
  }

  function layout(max_height) {
    var size = window.innerWidth - 10;
    var n = 0;
    var images = [].slice.call(document.querySelectorAll('.photo-container img'));
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

  window.addEventListener('resize', function () { layout(MAX_HEIGHT); });
})();