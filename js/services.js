'use strict';

/* Services */


// Demonstrate how to register services

// In this case it is a simple value service.
// 90% of the time, either .value() or .factory() will get the job done for services 
// service doesnt have access to the scope object so we need to inject the 
angular.module('myApp.services', [])

  .value('FIREBASE_URL', 'https://dazzling-torch-8938.firebaseio.com/')

  .factory('dataService', function($firebase, FIREBASE_URL){
  	var dataReference = new Firebase(FIREBASE_URL);
  	var fireData = $firebase(dataReference);

  	return fireData;
  })
  .factory('partyService', function(dataService /*, $firebase, FIREBASE_URL*/){
  	//var partiesRef = new Firebase(FIREBASE_URL + 'parties');
  	//var parties = $firebase(partiesRef);

  	// the child method will get the location
  	//var parties = dataService.$child('parties'); dont have parties anymore
  	//for new data structure							
  	var users = dataService.$child('users');

  	var partyServiceObject = {
  		//parties: parties, this was refrencing var parties
  		saveParty: function(party, userId){

  		//  save the data to a new location,to users, 
  		//  so it loads for an user, that;s why we are passing in userId
  		//	parties.$add(party);
  		users.$child(userId).$child('parties').$add(party);
  		//	$scope.parties.$add($scope.newParty);
		//	$scope.newParty = {name: '', phone: '', size: '', done: false, notified: "No"};

  		},
  		//use a method to load parties based on single user
  		getPartiesByUserId: function(userId){
  			return users.$child(userId).$child('parties');
  		}
  	};
  	return partyServiceObject;
  })

  .factory('textMessageService', function(dataService, /*$firebase, FIREBASE_URL,*/ partyService){
	//add object to db
/*
	var textMessageRef = new Firebase(FIREBASE_URL + 'textMessages');
	var textMessages = $firebase(textMessageRef);
*/
	var textMessages = dataService.$child('textMessages');

	var textMessageServiceObject ={
		sendTextMessage: function(party, userId){
			var newTextMessage = {
				//must access party info, get from controller
				phoneNumber: party.phone,
				size: party.size,
				name: party.name
			};
			textMessages.$add(newTextMessage);
		/*
			// modify the notified property to yes and
			// saving the local changes and push them to firebase
			// wont work because partyService doesn't have the parties property
			party.notified = 'Yes';
			//$scope.parties.$save(party.$id);
			partyService.parties.$save(party.$id);
		*/
		//grab the userId's party id and update notified to yes
		partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified: 'Yes'});
		}
	};

	return textMessageServiceObject;
  })

  .factory('authService',function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL, dataService){
  	var authRef = new Firebase(FIREBASE_URL); //brought over for authentication
	var auth = $firebaseSimpleLogin(authRef);
	var emails = dataService.$child('emails');

  	var authServiceObject = {
  		register: function(user){
  			auth.$createUser(user.email, user.password).then(function(data){
				//checkout what's happening in the console
				console.log(data);
				//after creating the user, get the email and use firebase $add to 
				//add an object(email)
				//then get the user object passed into the function and get the email property from the user object
				

				authServiceObject.login(user, function(){
					//moving emails in here because login is syncronous and cannot determine when login happens
					emails.$add({email: user.email});
				});
				//this is calling from the firebase api
				//auth.$login('password', $scope.user);
			});
  		},
  		login: function(user, optionalCallback){
			auth.$login('password', user).then(function(data){
				console.log(data);

				if (optionalCallback){
					optionalCallback();
				}

				$location.path('/waitlist');
			});

  		},
  		logout: function(){
			auth.$logout();
			$location.path('/');
  		},
  		getCurrentUser: function(){
  			return auth.$getCurrentUser();
  		}
  	};


  	//have a current user object saved when logged in and deleted on logout
  	//adding this for login/logout links to appear

  	//firebase example
  	$rootScope.$on("$firebaseSimpleLogin:login", function(e, user){
  		//console.log("User " + user.id + " recently logged in!");
  		//save current user on rootScope (parent of all the scope in the application)
  		$rootScope.currentUser = user;
  	});

  	$rootScope.$on("$firebaseSimpleLogin:logout", function(){
  		//all other scopes can see that there is no user, no app for you
  		$rootScope.currentUser = null;
  	});

  	return authServiceObject;
  });
