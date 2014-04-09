(function() {
  'use strict';

  var gallery = angular.module('gallery', [
    'http-auth-interceptor',
    'ui.router',
    'login',
    'photo'
  ]);

  // The URL of the REST API.
  gallery.constant('apiUrl', 'https://secure.tuhoojabotti.com/gallery/');

  gallery.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    // Rewrite all non-existent routes to index.
    $urlRouterProvider.otherwise('/');
  });

  gallery.controller('GalleryController',
  function ($log, $scope, $state, authService, loginModal) {

    $scope.logged = false;
    $scope.name = '';

    $scope.$on('event:auth-loginRequired', function () {
      $scope.logged = false;
      loginModal();
    });

    $scope.$on('event:auth-loginConfirmed', function () {
      $log.debug('login confirmed!');
      $scope.logged = true;

      FB.api('/me', function(response) {
        $scope.name = response.name;
        $scope.$digest();
      });
    });

    $scope.$on('event:auth-loginCancelled', function () {
      $log.debug('login cancelled!');
      $scope.logged = false;
      $scope.name = '';
    });
  });

})();