(function() {
  'use strict';

  var gallery = angular.module('gallery', [
    'http-auth-interceptor',
    'login',
    'photo'
  ]);

  // The URL of the REST API.
  gallery.constant('apiUrl', 'https://secure.tuhoojabotti.com/gallery/');

  gallery.controller('GalleryController',
  function ($log, $scope, loginModal, authService) {

    $scope.logged = false;
    $scope.name = '';

    $scope.$on('event:auth-loginRequired', function () {
      $scope.logged = false;
    	$scope.modal = loginModal();

      $scope.modal.result.catch(function () {
        authService.loginCancelled();
      });
    });

    $scope.$on('event:auth-loginConfirmed', function () {
      $log.debug('login confirmed!');
      $scope.logged = true;

      if ($scope.modal) {
        $scope.modal.close();
      }

      FB.api('/me', function(response) {
        $scope.name = response.name;
        $scope.$digest();
      });
    });

    $scope.$on('event:auth-loginCancelled', function () {
      $log.debug('login cancelled!');
      $scope.logged = false;
      $scope.name = '';
      // If we were deleting a node, reset it.
      angular.element(document.querySelector('.thumb.delete')).removeClass('delete');
    });
  });

})();