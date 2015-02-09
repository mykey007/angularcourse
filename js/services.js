'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// 90% of the time, either .value() or .factory() will get the job done for services 
// service doesnt have access to the scope object so we need to inject the 
angular.module('myApp.services', [])
  .value('FIREBASE_URL', 'https://dazzling-torch-8938.firebaseio.com/')
  .factory('authService',function($firebaseSimpleLogin, $location, FIREBASE_URL){
  	var authRef = new Firebase(FIREBASE_URL); //brought over for auth
	var auth = $firebaseSimpleLogin(authRef);

  	var authServiceObject = {
  		register: function(user){
  			auth.$createUser(user.email, user.password).then(function(data){
				//checkout what's happening under the hood
				console.log(data);
				authServiceObject.login(user);
				//this is calling from the firebase api
				//auth.$login('password', $scope.user);
			});
  		},
  		login: function(user){
			auth.$login('password', user).then(function(data){
				console.log(data);
				$location.path('/waitlist');
			});

  		},
  		logout: function(){
			auth.$logout();
			$location.path('/');
  		}
  	};
  	return authServiceObject;
  });
  
  /* But wait.. There's More!
  .factory('FIREBASE_URL', function(){
  	return 'https://dazzling-torch-8938.firebaseio.com/'; 
  });
  */
