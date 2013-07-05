'use strict';

angular.module('corspediaResults', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{@');
    $interpolateProvider.endSymbol('@}');
}); 

var QUERY_URL_FORMAT = '/query?code=<modCode>&fac=<faculty>&acc=<accType>&new=<newStudent>';

function resultsController($scope, $http) {

	$scope.modCode = modCode;
	$scope.faculty = faculty;
	$scope.accType = accType;
	$scope.newStudent = newStudent;

	function constructQueryURL() {
		return QUERY_URL_FORMAT.replace('<modCode>', $scope.modCode).
								replace('<faculty>', $scope.faculty).
								replace('<accType>', $scope.accType).
								replace('<newStudent>', $scope.newStudent);				
	}

	$http.get(constructQueryURL()).success(function(res) {
		$scope.data = res;
		console.log($scope.data);
		var bid_history = [];
		for (var sem in $scope.data.BidHistory) {
			for (var lecture_grp in $scope.data.BidHistory[sem]) {
				for (var bidding_round in $scope.data.BidHistory[sem][lecture_grp]) {
					var obj = { sem: sem, 
								bidding_round: bidding_round, 
								lecture_grp: lecture_grp, 
								value: $scope.data.BidHistory[sem][lecture_grp][bidding_round]};
					bid_history.push(obj);
				}
			}
		}
		console.log(bid_history);
		$scope.data.bid_history = bid_history;
	}).error(function(res) {
		alert('An error occurred.');
	});
}