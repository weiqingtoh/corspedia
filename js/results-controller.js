'use strict';

angular.module('corspediaResults', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{@');
    $interpolateProvider.endSymbol('@}');
}); 

var QUERY_URL_FORMAT = '/query?code=<modCode>&fac=<faculty>&acc=<accType>&new=<newStudent>';
var RESULTS_URL_FORMAT = '/results?code=<modCode>&fac=<faculty>&acc=<accType>&new=<newStudent>';

function resultsController($scope, $http, $timeout) {

	$scope.modCode = modCode;
	$scope.faculty = faculty;
	$scope.accType = accType;
	$scope.newStudent = newStudent.toString();
	$scope.loading = true;
	$scope.error = false;
	$scope.loading_section = {'loading-screen': true, 'invisible': !$scope.loading};
	$scope.results_section = {'container': true, 'invisible': $scope.loading};
	$scope.empty_data = true;

	$scope.show_search_section = false;

	$scope.showSearchContainer = function() {
		$('#search-container').toggle("blind");
	}

	function constructQueryURL() {
		return QUERY_URL_FORMAT.replace('<modCode>', $scope.modCode).
								replace('<faculty>', $scope.faculty).
								replace('<accType>', $scope.accType).
								replace('<newStudent>', $scope.newStudent);				
	}

	$scope.newSearch = function() {
		window.location = constructQueryURL().replace('query', 'results');
	}

	function syncLoadingState() {
		$scope.loading_section.invisible = !$scope.loading;
		$timeout(function() {
			$scope.results_section.invisible = $scope.loading;
		}, 500);
		try {
			$scope.$apply();
		} catch (err) {};
	}

	$scope.idify = function(str) {
		var string = str.toLowerCase().split(' ').join('-');
		console.log(string);
		return string;
	};

	function fetchResults() {
		$scope.loading = true;
		$http.get(constructQueryURL()).success(function(res) {
			$scope.data = res;
			console.log(res);
			if ($scope.data.module_error || $scope.data.faculty_error) {
				$scope.error = true;
				return;
			}
			for (var i = 0; i < $scope.data.bid_history_by_year.length; i++) {
				if ($scope.data.bid_history_by_year[i].data.length > 0) {
					$scope.empty_data = false;
					break;
				}
			}
			setTimeout(function() {
				if (!$scope.empty_data) {
					$timeout(function() {
						$("#bidding-history-table").tabs();
					}, 0);
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

	fetchResults();
}