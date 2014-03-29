(function() {
  'use strict';

  var api = 'https://secure.tuhoojabotti.com/gallery/login'

  angular.module('rating', [])

  .controller('RatingController', function ($scope, $http) {

    $scope.rate = function() {
      console.log('rating!');
      $http.post(api).success(function(response) {
        // lol
      });
    }

  });
})();