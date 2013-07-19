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
		setTimeout(function() {
			$("#bidding-history-table").tabs();
		}, 0);
	}).error(function(res) {
		alert('An error occurred.');
	});
}