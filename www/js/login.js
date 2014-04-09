(function() {
	'use strict';

	var login = angular.module('login', [
		'http-auth-interceptor',
		'ui.bootstrap'
	]);

	login.factory('loginModal', function ($http, $log, $modal, authService) {
		return function () {
			$modal.open({
				templateUrl: 'login.html',
				backdrop: 'static',
				windowClass: 'login',
				controller: ['$scope', function ($scope) {
					$scope.login = FB.login;

					FB.Event.subscribe('auth.login', function (res) {
						if (res.status !== 'connected') { return; }
						$log.debug('fb logged in!');
						$http.defaults.headers.common['Authorization'] = res.authResponse.accessToken;
						$scope.$close();
						authService.loginConfirmed();
					});
				}]
			}).result.catch(function () {
				$log.debug('login modal dissmissed');
				authService.loginCancelled();
			});
		};
	});

	login.controller('LoginController',
	function ($log, apiUrl, $scope, $http, $window, authService) {
		$window.fbAsyncInit = function() {
			$log.debug('fb init done');

			FB.init({
				appId:  '1416953981896946',
				status: true, // check login status
				cookie: true, // enable cookies to allow the server to access the session
				xfbml:  false // parse XFBML
			});

			// Check login status on page load.
			FB.getLoginStatus(function (res) {
				if (res.status === 'connected') {
					$log.debug('fb logged in!');
					$http.defaults.headers.common['Authorization'] = res.authResponse.accessToken;
					authService.loginConfirmed();
				}
			});
		};

		$scope.logout = function() {
			// Remove access token.
			delete $http.defaults.headers.common['Authorization'];
			// Log out from Facebook.
			FB.logout(function () {
				$log.debug('fb logout');
				authService.loginCancelled();
				$scope.$digest(); // Tell Angular to update.
			});
		};

		// Load Facebook SDK.
	  (function(d){
	   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	   if (d.getElementById(id)) {return;}
	   js = d.createElement('script'); js.id = id; js.async = true;
	   js.src = "//connect.facebook.net/en_US/all.js";
	   ref.parentNode.insertBefore(js, ref);
	  }(document));
	});

})();
