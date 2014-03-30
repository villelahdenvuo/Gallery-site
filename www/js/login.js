(function() {
  'use strict';

	FB.init({
		appId      : '1416953981896946',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});

  angular.module('login', ['http-auth-interceptor'])

  .controller('LoginController', function ($rootScope, $http, authService) {
		FB.Event.subscribe('auth.authResponseChange', function(res) {
		  // Here we specify what we do with the response anytime this event occurs.
		  if (res.status === 'connected') {
		  	console.log('fb logged');
				$http.defaults.headers.common['Authorization'] = res.authResponse.accessToken;
		  	authService.loginConfirmed();
		  }
		});
	});

})();
