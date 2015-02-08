'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function(){

	}])
	.controller('WaitListController', ['$scope', '$firebase', function($scope, $firebase){
		var partiesRef = new Firebase('https://dazzling-fire-3767.firebaseio.com/');

		//scope is an object that html and js share
		//collect data from the form and store it in an array
		$scope.parties = $firebase(partiesRef);

		$scope.party = {name: '', phone: '', size: ''};

		$scope.saveParty = function(){
			//take party object and put it in the parties array
			$scope.parties.$add($scope.party);
			$scope.party = {name: '', phone: '', size: ''};
		};
	}]);

