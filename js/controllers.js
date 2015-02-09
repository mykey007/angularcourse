'use strict';

/* Controllers */
// 1 619-780-2237
angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function(){

	}])
	.controller('WaitListController', ['$scope', '$firebase', function($scope, $firebase){
		// connecting $scope.parties to live firebase data
		var partiesRef = new Firebase('https://dazzling-torch-8938.firebaseio.com/parties');

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
			var textMessageRef = new Firebase('https://dazzling-torch-8938.firebaseio.com/textMessages');
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
	.controller('AuthController', ['$scope', '$firebaseSimpleLogin', function($scope, $firebaseSimpleLogin){
		var authRef = new Firebase('https://dazzling-torch-8938.firebaseio.com/');

		var auth = $firebaseSimpleLogin(authRef);

		$scope.user = {email: '', password: ''};
		// crate the user
		//this method returns an angular promise
		//the server promises to deliver data back. either we get data or there is an error
		$scope.register = function(){
			//angular promise
			auth.$createUser($scope.user.email, $scope.user.password).then(function(data){
				console.log(data);
				auth.$login('password', $scope.user);
			});
		};

		$scope.login = function(){
			auth.$login('password', $scope.user).then(function(data){
				console.log(data);
			});

		};
	}])
;