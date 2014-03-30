(function() {
  'use strict';

  var api = 'https://secure.tuhoojabotti.com/gallery/';

/*	FB.init({
		appId:  '1416953981896946',
		status: true, // check login status
		cookie: true, // enable cookies to allow the server to access the session
		xfbml:  false  // parse XFBML
	});*/

  angular.module('login', ['http-auth-interceptor'])

  .controller('LoginController', function ($scope, $http, authService) {

		FB.Event.subscribe('auth.authResponseChange', function(res) {
		  if (res.status === 'connected') {
		  	console.log('fb logged in!');
				$http.defaults.headers.common['Authorization'] = res.authResponse.accessToken;
		  	authService.loginConfirmed();
		  }
		});

		// for testing
    $scope.login = function() {
      $http.post(api + 'user/verify').success(function(res) {
        console.log('api verified!', res);
      });
    };

    $scope.logout = function() {
			FB.logout(function(response) {
				console.log('fb logout');
				delete $http.defaults.headers.common['Authorization'];
				authService.loginCancelled();
			});
    };

    $('#login .cancel').click(function () {
      authService.loginCancelled();
    });
	});

})();
