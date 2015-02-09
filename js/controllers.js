'use strict';

/* create some services
	services are javascript functions and properties of related tasks you want to accoomplish
	code resue and avoidance of repetition.
	we made FIREBASE_URL to handle the url strings

	*/


/* Controllers */
angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function(){

	}])
	.controller('WaitListController', ['$scope', '$firebase', 'FIREBASE_URL', function($scope, $firebase, FIREBASE_URL){
		// connecting $scope.parties to live firebase data
		var partiesRef = new Firebase(FIREBASE_URL + 'parties');

		//scope is an object that html and js share
		//collect data from the form and store it in an array
		$scope.parties = $firebase(partiesRef);

		// object to store data from waitlist form
		$scope.newParty = {name: '', phone: '', size: '', done: false, notified: "No"};



		// function to save a new party to the waitlist
		$scope.saveParty = function(){
			//take party object and put it in the parties array
			$scope.parties.$add($scope.newParty);
			$scope.newParty = {name: '', phone: '', size: '', done: false, notified: "No"};
		};

		//function to send text message to a party
		$scope.sendTextMessage = function(party){
			//add object to db
			var textMessageRef = new Firebase(FIREBASE_URL + 'textMessages');
			var textMessages = $firebase(textMessageRef);
			var newTextMessage = {
				phoneNumber: party.phone,
				size: party.size,
				name: party.name
			};
			textMessages.$add(newTextMessage);
			//code here for notified
			party.notified = 'Yes';
			$scope.parties.$save(party.$id);
		};
	}])
	.controller('AuthController', ['$scope', '$firebaseSimpleLogin', '$location', 'FIREBASE_URL', 'authService', function($scope, $firebaseSimpleLogin, $location, FIREBASE_URL, authService){
		var authRef = new Firebase(FIREBASE_URL);

		var auth = $firebaseSimpleLogin(authRef);

		$scope.user = {email: '', password: ''};
		// crate the user
		//this method returns an angular promise
		//the server promises to deliver data back. either we get data or there is an error
		$scope.register = function(){
			//angular promise ( .then() )
			auth.$createUser($scope.user.email, $scope.user.password).then(function(data){
				//checkout what's happening under the hood
				console.log(data);

				//this is calling from the firebase api
				//auth.$login('password', $scope.user);

				//instead we want to call a custom login function to handle redirects
				$scope.login();
			});
		};

		$scope.login = function(){
			authService.login($scope.user);
			

		};

		$scope.logout = function(){
			auth.$logout();
			// redirect users to landing page
			$location.path('/');
		};
	}])
;