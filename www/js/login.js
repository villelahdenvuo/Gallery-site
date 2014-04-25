(function() {
	'use strict';

	var login = angular.module('login', [
		'http-auth-interceptor',
		'ui.bootstrap',
		'facebook'
	]);

	login.config(['$facebookProvider', function ($facebookProvider) {
    $facebookProvider.init({
      appId: '1416953981896946',
      status: true,
			cookie: true,
			xfbml:  false
    });
	}]);

	login.factory('loginModal',
	function ($http, $log, $modal, authService, $facebook) {
		return function () {
			$modal.open({
				templateUrl: 'views/login.html',
				backdrop: 'static',
				windowClass: 'login',
				controller: ['$scope', function ($scope) {
					$scope.login = $facebook.login;

					$scope.$on('facebook.auth.login', function (e, res) {
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
	function ($log, apiUrl, $scope, $http, $facebook, authService) {

		// Check if user was already logged in.
		$facebook.getLoginStatus().then(function (res) {
			if (res.status === 'connected') {
				$log.debug('fb logged in!');
				$http.defaults.headers.common['Authorization'] = res.authResponse.accessToken;
				authService.loginConfirmed();
			}
		});

		$scope.logout = function() {
			delete $http.defaults.headers.common['Authorization'];
			$facebook.logout().then(function () {
				$log.debug('fb logout');
				authService.loginCancelled();
			});
		};

	});

})();