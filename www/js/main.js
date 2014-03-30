(function() {
  'use strict';

  angular.module('gallery', [
    'http-auth-interceptor',
    'login',
    'rating',
    'photo'
  ])

  .controller('GalleryController', function ($scope) {
    $scope.logged = false;
    $scope.name = '';

    $scope.$on('event:auth-loginRequired', function() {
      $scope.logged = false;
      console.log('show modal');
      $('#login').modal('show');
    });

    $scope.$on('event:auth-loginConfirmed', function() {
      $scope.logged = true;
      console.log('logged in!');
      $('#login').modal('hide');
      FB.api('/me', function(response) {
        $scope.name = response.name;
        $scope.$digest();
      });
    });

    $scope.$on('event:auth-loginCancelled', function() {
      $scope.logged = false;
      console.log('login cancelled!');
      $scope.name = '';
      $scope.$digest();
    });
  });

})();