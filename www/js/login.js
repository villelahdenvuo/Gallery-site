(function() {
	'use strict';

	var login = angular.module('login', [
		'http-auth-interceptor',
		'ui.bootstrap',
		'facebook'
	]);

	login.config(function ($provide) {
		$provide.decorator('$state', function ($delegate, $stateParams) {
			$delegate.forceReload = function () {
				return $delegate.go($delegate.current, $stateParams,
					{ reload: true, inherit: false, notify: true });
			};
			return $delegate;
		});
	});

	login.config(['$facebookProvider', function ($facebookProvider) {
		$facebookProvider.init({
			appId: '1416953981896946',
			status: true,
			cookie: true,
			xfbml:  false
		});
	}]);

	login.factory('loginModal',
	function ($http, $log, $modal, authService, $facebook, $state, $stateParams) {
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
				$state.forceReload();
			});
		};
	});

	login.factory('errorModal', function ($modal, $state, $stateParams) {
		return function () {
			$modal.open({ windowClass: 'login', templateUrl: 'views/denied.html' })
				.result.catch(function () { $state.forceReload(); });
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