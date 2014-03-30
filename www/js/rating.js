(function() {
  'use strict';

  var api = 'https://secure.tuhoojabotti.com/gallery/user/verify'

  angular.module('rating', [])

  .controller('RatingController', function ($scope, $http) {

    $scope.rate = function() {
      $http.post(api).success(function(response) {
        console.log('verified!');
      });
    }

  });
})();