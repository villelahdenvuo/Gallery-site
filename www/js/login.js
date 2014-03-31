(function() {
	'use strict';

/*	FB.init({
		appId:  '1416953981896946',
		status: true, // check login status
		cookie: true, // enable cookies to allow the server to access the session
		xfbml:  false  // parse XFBML
	});*/

	var login = angular.module('login', [
		'http-auth-interceptor',
		'ui.bootstrap'
	]);

	login.factory('loginModal', function ($log, $modal) {
		function ctrl($scope) {
			$scope.login = FB.login;
		}
		return function loginModal() {
			$log.debug('showing modal');
			return $modal.open({
				templateUrl: 'facebookLogin.html',
				backdrop: 'static',
				keyboard: false,
				controller: ctrl
			});
		};
	});

	login.controller('LoginController',
	function ($log, apiUrl, $scope, $http, authService) {

		FB.Event.subscribe('auth.authResponseChange', function(res) {
			if (res.status === 'connected') {
				$log.debug('fb logged in!');
				$http.defaults.headers.common['Authorization'] = res.authResponse.accessToken;
				authService.loginConfirmed();
			}
		});

		// for testing only
		$scope.verify = function() {
			$http.post(apiUrl + 'user/verify').success(function(res) {
				$log.debug('api verified!', res);
			});
		};

		$scope.logout = function() {
			// Remove access token.
			delete $http.defaults.headers.common['Authorization'];
			// Log out from Facebook.
			FB.logout(function(response) {
				$log.debug('fb logout');
				authService.loginCancelled();
				$scope.$digest(); // Tell Angular to update.
			});
		};
	});

})();
