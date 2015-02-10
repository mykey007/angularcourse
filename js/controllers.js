'use strict';

/* create some services
	services are javascript functions and properties of related tasks you want to accoomplish
	code resue and avoidance of repetition.
	ex: FIREBASE_URL to handle the url strings
*/


/* Controllers */
angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function(){

	}])
	.controller('WaitListController', ['$scope', 'partyService', 'authService', 'textMessageService',function($scope, partyService, authService, textMessageService){
		// connecting $scope.parties to live firebase data

		//binds firebase parties to the scope
		//no more parties property, in the service
		//$scope.parties = partyService.parties;

		//Bind user's parties to $scope.parties.
		//call authService and use the getCurrentUser method from sericves.js
		//and return user object
		authService.getCurrentUser().then(function(user){
			//if logged in
			if (user){
				//$scope.parties is used by the template to iterate over
				$scope.parties = partyService.getPartiesByUserId(user.id);
			}
		})

		// object to store data from waitlist form
		$scope.newParty = {name: '', phone: '', size: '', done: false, notified: "No"};



		// function to save a new party to the waitlist
		$scope.saveParty = function(){
			//take party object and put it in the parties array
		//	$scope.parties.$add($scope.newParty);
		//	$scope.newParty = {name: '', phone: '', size: '', done: false, notified: "No"};
			partyService.saveParty($scope.newParty, $scope.currentUser.id);
			$scope.newParty = {name: '', phone: '', size: '', done: false, notified: "No"};
		};

		//function to send text message to a party
		$scope.sendTextMessage = function(party){
			textMessageService.sendTextMessage(party, $scope.currentUser.id);
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