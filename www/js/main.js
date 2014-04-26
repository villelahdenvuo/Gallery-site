(function() {
  'use strict';

  var gallery = angular.module('gallery', [
    'ngAnimate',
    'http-auth-interceptor',
    'ui.router',
    'facebook',
    'ngTagsInput',
    'api',
    'login',
    'photo',
    'tag'
  ]);

  // The URL of the REST API.
  gallery.constant('apiUrl', 'https://secure.tuhoojabotti.com/gallery/');

  gallery.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    // Rewrite all non-existent routes to index.
    $urlRouterProvider.otherwise('/');
  });

  gallery.controller('GalleryController',
  function ($log, $scope, $state, $facebook, authService, loginModal) {

    // Esc to go home.
    angular.element(document.body).on('keyup', function (e) {
      if (e.keyCode === 27) { $state.go('photos'); }
    });

    $scope.logged = false;
    $scope.name = '';

    $scope.$on('event:auth-loginRequired', function () {
      $scope.logged = false;
      loginModal();
    });

    $scope.$on('event:auth-loginConfirmed', function () {
      $log.debug('login confirmed!');
      $facebook.api('/me').then(function (res) {
        $scope.user = res;
        $scope.logged = true;
      });
    });

    $scope.$on('event:auth-loginCancelled', function () {
      $log.debug('login cancelled!');
      $scope.name = '';
      $scope.logged = false;
    });
  });

})();