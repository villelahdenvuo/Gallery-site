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
    $stateProvider.state("home", {
      url: '/',
      templateUrl: "index.html"
    });
    // Rewrite all non-existent routes to index.
    //$urlRouterProvider.otherwise('/');
  });

  gallery.controller('GalleryController',
  function ($log, $scope, $state, authService) {

    $scope.logged = false;
    $scope.name = '';

    $scope.$on('event:auth-loginRequired', function () {
      $scope.logged = false;
      $state.go('home.login');
    });

    $scope.$on('event:auth-loginConfirmed', function () {
      $state.go('home');
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