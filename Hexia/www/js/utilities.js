var utils = angular.module('utilities',['dummy'])

.value('menuList', [{
		text: 'Twitter Feed',
		icon: 'ion-home',
		state: 'menu.feed'
	},{
		text: 'View Mentions',
		icon: 'ion-help',
		state: 'menu.mentions'
	},{
		text: 'View Direct Messages',
		icon: 'ion-android-exit',
		state: 'menu.messages'
	},{
		text: 'Logout',
		icon: 'ion-android-exit',
		click: 'logout()'
	}
])

.factory('localstorage', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return angular.fromJson(JSON.parse($window.localStorage[key] || "{}"));
		},
		list: function() {
			return $window.localStorage;
		},
		deleteObject: function(key) {
			$window.localStorage.removeItem(key);
		},
		clearObjects: function() {
			$window.localStorage.clear();
		}
	};
})

.factory('itemStorage', function() {
	var itemStore = {};

	return {
		set: function(key,value) {
			itemStore[key] = value;
		},
		get: function(key) {
			return itemStore[key];
		},
		delete: function(key) {
			itemStore[key] = undefined;
		},
		getAll: function() {
			return itemStore;
		}
	};
})

.factory('loader', function($ionicLoading) {
	return {
		show: function(loadingString) {
			if(loadingString === undefined) {
				loadingString = "";
			}

			$ionicLoading.show({
				template: '<ion-spinner></ion-spinner><p>'+loadingString+'</p>'
			});
		},
		hide: function() {
			$ionicLoading.hide();
		}	
	};
})

.factory('twitter', function($http, $q, $cordovaOauth, $cordovaOauthUtility, $resource, localstorage,loader,feed,$rootScope) {
    
    //Set up API keys
    var applicationID = '0EnyFIvJFgnB5oeZgiloFGEfr';
    var applicationSecret = 'twNen1tMonZXt2dv0f3k06XWErXd1Z8e3sCZQwoWerAnPwIHiO';

    //Set and Get User Tokens
    function setUserToken(data) {
        localstorage.setObject("userToken", JSON.stringify(data));
    }

    function getUserToken() {
        var token = localstorage.getObject("userToken");
        if($.isEmptyObject(token)) {
        	return undefined;
        } else {
        	return token;
        }
    }

    //Generate a twitter signature
    function createTwitterSignature(method, url, parameters) {
    	var params = parameters || {};
        var userToken = getUserToken();
        var signatureParams = {
            oauth_consumer_key: applicationID,
            oauth_nonce: $cordovaOauthUtility.createNonce(10),
            oauth_signature_method: "HMAC-SHA1",
            oauth_token: userToken.oauth_token,
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_version: "1.0"
        };
        var signature = $cordovaOauthUtility.createSignature(method, url, signatureParams, params, applicationSecret, userToken.oauth_token_secret);
        $http.defaults.headers.common.Authorization = signature.authorization_header;
    }

    return {
        authenticate: function() {
            var deferred = $q.defer();
            var token = getUserToken();

            if (token !== undefined) {
                deferred.resolve(true);
            } else {
                $cordovaOauth.twitter(applicationID, applicationSecret).then(function(result) {
                    setUserToken(result);
                    deferred.resolve(true);
                }, function(error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        },
        isAuthenticated: function() {
            if(getUserToken() !== undefined) {
            	return true;
            } else {
            	return false;
            }
        },
        getFeed: function() {
            var requestUrl = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
            var params = {"count":"100"};
            createTwitterSignature('GET', requestUrl, params);
            $rootScope.$broadcast('scroll.refreshComplete');
            return $resource(requestUrl, params).query();
        },
    	getMentions: function() {
    		var requestUrl = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json';
    		createTwitterSignature('GET', requestUrl);
    		$rootScope.$broadcast('scroll.refreshComplete');
            return $resource(requestUrl).query();
    	},
    	getMessages: function() {
    		var requestUrl = 'https://api.twitter.com/1.1/direct_messages.json';
    		createTwitterSignature('GET', requestUrl);
    		$rootScope.$broadcast('scroll.refreshComplete');
            return $resource(requestUrl).query();
    	},
    	postTweet: function(data) {
    		var requestUrl = 'https://api.twitter.com/1.1/statuses/update.json';
    		var params = {"status":data};
    		createTwitterSignature('POST', requestUrl, params);
            return $resource(requestUrl, params).save();
    	},
    	postMessage: function(user,data) {
    		var requestUrl = 'https://api.twitter.com/1.1/direct_messages/new.json';
    		var params = {"text":data, "screen_name":user};
    		createTwitterSignature('POST', requestUrl, params);
            return $resource(requestUrl, params).save();
    	},
    	getTimeline: function(user) {
    		var requestUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
    		var params = {"screen_name":user};
    		console.log(user);
    		createTwitterSignature('GET', requestUrl, params);
    		$rootScope.$broadcast('scroll.refreshComplete');
    		return $resource(requestUrl, params).query();
    	},
        setUserToken: setUserToken,
        getUserToken: getUserToken,
        createTwitterSignature: createTwitterSignature
    	};
})

.factory('parser', function() {
	return {
		date: function(dateString) {
			var dateObj = new Date(dateString);
			return dateObj;
		}
	};
});