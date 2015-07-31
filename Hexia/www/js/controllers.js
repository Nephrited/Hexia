angular.module('controllers', ['ngCordovaOauth','utils'])

.controller('LoginController', function($scope,$cordovaOauth,localstorage,twitter) {

	//Probably move all this to a service.
	clientId = "cY81c6OLBBrXVRyUM0LpAeAEm";
	clientSecret = "5MJ9cCEP23Cl8LmlEPhDkoFBGN31IVwzXnssSyYLiEYPAXyoFl";

	$scope.string = "Data will show up here...";
	$scope.login = function() {
		twitter.initialize().then(function(result) {
			if(result === true) {
				console.log("signed in!");
			}
		});
	};

	$scope.testDisplay = function() {

		$scope.timeline = twitter.getHomeTimeline();
		console.log($scope.timeline);

	};

});