(function() {
  'use strict';

  angular.module('gallery', [
    'http-auth-interceptor',
    'login',
    'rating',
    'photo',
    'ui.bootstrap'
  ])

  .controller('GalleryController', function ($scope, $modal, authService) {
    $scope.logged = false;
    $scope.name = '';

    $scope.$on('event:auth-loginRequired', function() {
      $scope.logged = false;
      console.log('show modal');

      $scope.modalInstance = $modal.open({
        templateUrl: 'facebookLogin.html',
        backdrop: 'static',
        keyboard: false,
        controller: function ($scope) {
          $scope.login = FB.login.bind(FB);
        }
      })

      $scope.modalInstance.result.catch(function () {
        authService.loginCancelled();
      });
    });

    $scope.$on('event:auth-loginConfirmed', function() {
      $scope.logged = true;
      console.log('login confirmed!');

      // If we logged via the modal, close it.
      if ($scope.modalInstance) {
        $scope.modalInstance.close();
      }

      FB.api('/me', function(response) {
        $scope.name = response.name;
        $scope.$digest();
      });
    });

    $scope.$on('event:auth-loginCancelled', function() {
      console.log('login cancelled!');
      $scope.logged = false;
      $scope.name = '';
    });
  });

})();