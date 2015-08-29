angular.module('hexia', ['ionic','controllers','ngCordova','ngResource','ionic-material'])

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

		.state('menu.feed', {
			url: "/feed",
			views: {
				'menuContentView': {
					templateUrl: 'templates/_feed.html',
					controller: 'FeedController'
				}
			}
		})

		.state('menu.mentions', {
			url: "/mentions",
			views: {
				'menuContentView': {
					templateUrl: 'templates/_mentions.html',
					controller: 'MentionController'
				}
			}
		})

		.state('menu.messages', {
			url: "/messages",
			views: {
				'menuContentView': {
					templateUrl: 'templates/_messages.html',
					controller: 'MessageController'
				}
			}
		})

		.state('menu.timeline', {
			url: "/timeline",
			views: {
				'menuContentView': {
					templateUrl: 'templates/_timeline.html',
					controller: 'TimelineController'
				}
			}
		})

		;
});