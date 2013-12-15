'use strict';

function CatalogueController($scope, $http) {
	$scope.modules = [];
	console.log($scope.preferences_list);
	
	$http.get(CATALOGUE_API_FORMAT).success(function(res) {
		$scope.modules = res;
	});
	$scope.linkify = function(modCode) {
		return RESULTS_URL_FORMAT.replace('<modCode>', modCode).
								replace('<faculty>', $scope.preferences_list.faculty).
								replace('<accType>', $scope.preferences_list.accType).
								replace('<newStudent>', $scope.preferences_list.newStudent);
	}
}