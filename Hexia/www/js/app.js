angular.module('hexia', ['ionic','controllers','ngCordova','ngResource'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');

	$stateProvider
		.state('login', {
			url: '/login',
			views: {
				'applicationView': {
					templateUrl: 'templates/_login.html',
					controller: 'LoginController'
				}
			}
		})

		.state('menu', {
			abstract: true,
			url: '/menu',
			views: {
				'applicationView': {
					templateUrl: 'templates/_menu.html',
					controller: 'MenuController'
				}
			}
		})

		.state('menu.landing', {
			url: "/landing",
			views: {
				'menuContentView': {
					templateUrl: "templates/_landing.html"
				}
			}
		});
});