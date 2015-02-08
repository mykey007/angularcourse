'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function(){

	}])
	.controller('WaitListController', ['$scope', '$firebase', function($scope, $firebase){
		// connecting $scope.parties to live firebase data
		var partiesRef = new Firebase('https://dazzling-fire-3767.firebaseio.com/parties');

		//scope is an object that html and js share
		//collect data from the form and store it in an array
		$scope.parties = $firebase(partiesRef);

		// object to store data from waitlist form
		$scope.newParty = {name: '', phone: '', size: ''};

		// function to save a new party to the waitlist
		$scope.saveParty = function(){
			//take party object and put it in the parties array
			$scope.parties.$add($scope.newParty);
			$scope.newParty = {name: '', phone: '', size: ''};
		};

		//function to send text message to a party
		$scope.sendTextMessage = function(phoneNumber){
			//add object to db
			var textMessageRef = new Firebase('https://dazzling-fire-3767.firebaseio.com/textMessages');
			var textMessages = $firebase(textMessageRef);
			textMessages.$add({phoneNumber: phoneNumber});
		};
	}]);