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
	.controller('AuthController', ['$scope', 'authService', function($scope, authService){

		//object bound to inputs on the register and login pages
		$scope.user = {email: '', password: ''};

/*
you can do this but it's harder to understand 
and you need to read the html to see what the controller is supposed to do:
//setting the authSerivce dependency as the scope
		$scope.authService = authService;
		//in our templates:
		ng-click="authService.logout()"
		*/

		//method to register a new user usign the authService
		$scope.register = function(){
			authService.register($scope.user);			
		};
		//method to login a new user usign the authService
		$scope.login = function(){
			authService.login($scope.user);
		};
		//method to logout a new user usign the authService
		$scope.logout = function(){
			authService.logout();
		};
	}])
;