angular.module('controllers', ['ngCordovaOauth','utilities','dummy'])

.controller('LoginController', function($scope,$cordovaOauth,localstorage,twitter,ionicMaterialInk,$state) {

	ionicMaterialInk.displayEffect();

	$scope.login = function() {
		$state.go('menu.feed');

		if(twitter.isAuthenticated()) {
				$state.go("menu.feed");
		}

		twitter.authenticate().then(function(result) {
			if(result === true) {
				console.log("signed in!");
				$state.go('menu.feed');
			} else {
				console.log("error!");
			}
		});
	};

})

.controller('MenuController', function($scope,ionicMaterialInk,$state,menuList,localstorage) {

$scope.menu = menuList;

$scope.logout = function () {

	localstorage.deleteObject("userToken");
	$state.go('login');

};

})

.controller('FeedController', function($scope,$state,feed,$ionicPopup) {

	$scope.feed = {};
	$scope.data = {};

	$scope.$on("$ionicView.enter", function() {
		$scope.reloadFeed();
	});

	$scope.reloadFeed = function() {
		$scope.feed = feed;
	};

	$scope.openPopup = function() {
		var newTweet = $ionicPopup.show({
			template: '<input type="text" ng-model="data.newTweet" class="padding">',
			title: 'Enter Tweet',
			scope: $scope,
			buttons: [
				{ 	text: 'Cancel' },
				{ 	text: '<b>Send</b>', 
					type: 'button-positive',
					onTap: function(e) {
			  			if (!$scope.data.newTweet) {
			  				console.log("No");
			    			e.preventDefault();
			  			} else {
			    			return $scope.data.newTweet;
			  			}
					}
				}]	
			});
		newTweet.then(function(res) {
			console.log('Test!', res);
			console.log($scope.data.newTweet);
		});
	};
	
	$scope.viewProfile = function(username) {
		console.log(username);
		$state.go("menu.timeline");
	};

})

.controller('MentionController', function($scope,$state,mentions) {
	$scope.mentions = {};

	$scope.$on("$ionicView.enter", function() {
		$scope.reloadMentions();
	});

	$scope.reloadMentions = function() {
		$scope.mentions = mentions;
	};
})

.controller('MessageController', function($scope,$state,messages,$ionicPopup) {
	$scope.messages = {};
	$scope.data = {};

	$scope.$on("$ionicView.enter", function() {
		$scope.reloadMessages();
	});

	$scope.reloadMessages = function() {
		$scope.messages = messages;
	};

	$scope.openPopup = function() {
		var newMessage = $ionicPopup.show({
			template: '<input type="text" ng-model="data.recipient" placeholder="Recipient" class="padding"><input type="text" ng-model="data.newMessage" placeholder="Message" class="padding">',
			title: 'Enter Message',
			scope: $scope,
			buttons: [
				{ 	text: 'Cancel' },
				{ 	text: '<b>Send</b>', 
					type: 'button-positive',
					onTap: function(e) {
			  			if (!$scope.data.newMessage || !$scope.data.recipient) {
			  				console.log("No");
			    			e.preventDefault();
			  			} else {
			    			return $scope.data.newMessage;
			  			}
					}
				}]	
			});
		newMessage.then(function(res) {
			console.log('Test!', res);
			console.log($scope.data.newMessage);
		});
	};
})

.controller('TimelineController', function($scope,$state,timeline){
	$scope.timeline = {};

	$scope.$on("$ionicView.enter", function() {
		$scope.reloadTimeline();
	});

	$scope.reloadTimeline = function() {
		$scope.timeline = timeline;
	};

	
})

;