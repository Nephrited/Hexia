var utils = angular.module('utils',[])

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
			return JSON.parse($window.localStorage[key] || '{}');
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

.factory('twitter', function($http, $q, $cordovaOauth, $cordovaOauthUtility, $resource, localstorage) {
    
    //Set up API keys
    var applicationID = 'cY81c6OLBBrXVRyUM0LpAeAEm';
    var applicationSecret = '5MJ9cCEP23Cl8LmlEPhDkoFBGN31IVwzXnssSyYLiEYPAXyoFl';

    //Set and Get User Tokens
    //TODO - Remove these?
    function setUserToken(data) {
        localstorage.set("userToken", JSON.stringify(data));
    }

    function getUserToken() {
        return localstorage.get("userToken");
    }

    //Generate a twitter signature
    function createTwitterSignature(method, url) {
        var userToken = angular.fromJson(getUserToken());
        console.log(getUserToken());
        var signatureParams = {
            oauth_consumer_key: clientId,
            oauth_nonce: $cordovaOauthUtility.createNonce(10),
            oauth_signature_method: "HMAC-SHA1",
            oauth_token: userToken.oauth_token,
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_version: "1.0"
        };
        var signature = $cordovaOauthUtility.createSignature(method, url, signatureParams, {}, clientSecret, userToken.oauth_token_secret);
        $http.defaults.headers.common.Authorization = signature.authorization_header;
    }

    return {
        initialize: function() {
            var deferred = $q.defer();
            var token = getUserToken();

            if (token !== undefined) {
                deferred.resolve(true);
            } else {
                $cordovaOauth.twitter(clientId, clientSecret).then(function(result) {
                    setUserToken(result);
                    deferred.resolve(true);
                }, function(error) {
                    deferred.reject(false);
                });
            }
            return deferred.promise;
        },
        isAuthenticated: function() {
            return getUserToken() !== undefined;
        },
        getHomeTimeline: function() {
            var requestUrl = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
            createTwitterSignature('GET', requestUrl);
            return $resource(requestUrl).query();
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