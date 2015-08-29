angular.module('controllers', ['ngCordovaOauth','utilities','dummy'])

.controller('LoginController', function($scope,$cordovaOauth,localstorage,twitter,ionicMaterialInk,$state) {

	ionicMaterialInk.displayEffect();

	$scope.login = function() {
		if(twitter.isAuthenticated()) {
			$state.go("menu.feed");
		}

		twitter.authenticate().then(function(result) {
			if(result === true) {
				$scope.error = undefined;
				$state.go("menu.feed");
			} else {
				console.log("error!");
			}
			console.log("Test");
		},function(error) {
			$scope.error = "Unable to Authenticate";
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

.controller('FeedController', function($scope,$state,twitter,$ionicPopup,itemStorage) {

	$scope.feed = {};
	$scope.data = {};

	$scope.$on("$ionicView.enter", function() {
		$scope.reloadFeed();
	});

	$scope.reloadFeed = function() {
		$scope.error = undefined;
		var request = twitter.getFeed();
		request.query(function(response) {
			$scope.feed = response;
		}, function(error) {
			if(error.statusText === "") {
				$scope.error = "Unable to refresh";
			} else {
				$scope.error = error.statusText;
			}
			console.log($scope.error);
		});
	};

	$scope.openPopup = function() {
		var newTweet = $ionicPopup.show({
			template: '<input type="text" ng-model="data.newTweet" class="padding" maxlength="140">',
			title: 'Enter Tweet',
			scope: $scope,
			buttons: [
				{ 	text: 'Cancel' },
				{ 	text: '<b>Send</b>', 
					type: 'button-positive',
					onTap: function(e) {
			  			if (!$scope.data.newTweet) {
			    			e.preventDefault();
			  			} else {
			    			return $scope.data.newTweet;
			  			}
					}
				}]	
			});
		newTweet.then(function(res) {
			$scope.error = undefined;
			if(res !== undefined) {
				var request = twitter.postTweet(res);
				request.save(function(response) {
				}, function(error) {
					if(error.statusText === "") {
						$scope.error = "Unable to submit";
					} else {
						$scope.error = error.data.errors[0].message;
					}
				});
				$scope.data.newTweet = undefined;
			}
		});
	};
	
	$scope.viewProfile = function(username) {
		itemStorage.set('timelineUser',username);
		$state.go("menu.timeline");
	};

})

.controller('MentionController', function($scope,$state,twitter) {
	$scope.mentions = {};

	$scope.$on("$ionicView.enter", function() {
		$scope.reloadMentions();
	});

	$scope.reloadMentions = function() {
		$scope.error = undefined;
		var request = twitter.getMentions();
		request.query(function(response) {
			$scope.mentions = response;
		}, function(error) {
			if(error.statusText === "") {
				$scope.error = "Unable to refresh";
			} else {
				$scope.error = error.statusText;
			}
			console.log($scope.error);
		});
	};
})

.controller('MessageController', function($scope,$state,twitter,$ionicPopup) {
	$scope.messages = {};
	$scope.data = {};

	$scope.$on("$ionicView.enter", function() {
		$scope.reloadMessages();
	});

	$scope.reloadMessages = function() {
		$scope.error = undefined;
		var request = twitter.getMessages();
		request.query(function(response) {
			$scope.messages = response;
		}, function(error) {
			if(error.statusText === "") {
				$scope.error = "Unable to refresh";
			} else {
				$scope.error = error.statusText;
			}
			console.log($scope.error);
		});
	};

	$scope.openPopup = function() {
		var newMessage = $ionicPopup.show({
			template: '<input type="text" ng-model="data.recipient" placeholder="Recipient" class="padding"><input type="text" ng-model="data.newMessage" placeholder="Message" class="padding" maxlength="140">',
			title: 'Enter Message',
			scope: $scope,
			buttons: [
				{ 	text: 'Cancel' },
				{ 	text: '<b>Send</b>', 
					type: 'button-positive',
					onTap: function(e) {
			  			if (!$scope.data.newMessage || !$scope.data.recipient) {
			    			e.preventDefault();
			  			} else {
			    			return [$scope.data.recipient,$scope.data.newMessage];
			  			}
					}
				}]	
			});
		newMessage.then(function(res) {
			if(res !== undefined) {
				$scope.error = undefined;
				if(res !== undefined) {
					var request = twitter.postMessage(res[0],res[1]);
					request.save(function(response) {
					}, function(error) {
						if(error.statusText === "") {
							$scope.error = "Unable to submit";
						} else {
							console.log(error);
							$scope.error = error.data.errors[0].message.split(':')[1];
						}
					});
					$scope.data.newTweet = undefined;
				}

				$scope.data.recipient = undefined;
				$scope.data.newMessage = undefined;
			}
		});
	};
})

.controller('TimelineController', function($scope,$state,twitter,itemStorage){
	$scope.timeline = {};
	$scope.error = undefined;

	$scope.$on("$ionicView.enter", function() {
		$scope.error = undefined;
		$scope.reloadTimeline();
	});

	$scope.reloadTimeline = function() {
		$scope.error = undefined;
		var request = twitter.getTimeline(itemStorage.get('timelineUser'));
		request.query(function(response) {
			$scope.timeline = response;
		}, function(error) {
			if(error.statusText === "") {
				$scope.error = "Unable to refresh";
			} else {
				$scope.error = error.statusText;
			}
			console.log($scope.error);
		});
	};

	
})

;