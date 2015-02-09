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
  	return{
  		login: function(user){
			auth.$login('password', user).then(function(data){
				console.log(data);
				$location.path('/waitlist');
			});

  		}
  	}
  });
  
  /* But wait.. There's More!
  .factory('FIREBASE_URL', function(){
  	return 'https://dazzling-torch-8938.firebaseio.com/'; 
  });
  */
