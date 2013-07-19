'use strict';

angular.module('corspediaResults', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{@');
    $interpolateProvider.endSymbol('@}');
}); 

var QUERY_URL_FORMAT = '/query?code=<modCode>&fac=<faculty>&acc=<accType>&new=<newStudent>';

function resultsController($scope, $http, $timeout) {

	$scope.modCode = modCode;
	$scope.faculty = faculty;
	$scope.accType = accType;
	$scope.newStudent = newStudent;
	$scope.loading = true;
	$scope.error = false;
	$scope.loading_section = {'loading-screen': true, 'invisible': !$scope.loading};
	$scope.results_section = {'container': true, 'invisible': $scope.loading};
	$scope.empty_data = true;

	function constructQueryURL() {
		return QUERY_URL_FORMAT.replace('<modCode>', $scope.modCode).
								replace('<faculty>', $scope.faculty).
								replace('<accType>', $scope.accType).
								replace('<newStudent>', $scope.newStudent);				
	}

	function syncLoadingState() {
		$scope.loading_section.invisible = !$scope.loading;
		$timeout(function() {
			$scope.results_section.invisible = $scope.loading;
		}, 500);
		$scope.$apply();
	}

	$http.get(constructQueryURL()).success(function(res) {
		$scope.data = res;
		for (var i = 0; i < $scope.data.bid_history_by_year.length; i++) {
			if ($scope.data.bid_history_by_year[i].data.length > 0) {
				$scope.empty_data = false;
				break;
			}
		}
		setTimeout(function() {
			if (!$scope.empty_data) {
				$("#bidding-history-table").tabs();
			}
			$timeout(function() {
				$scope.loading = false;
				syncLoadingState();
			}, 500)
		});
	}).error(function(res) {
		$scope.error = true;
	});
}