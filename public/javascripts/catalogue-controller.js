'use strict';

function CatalogueController($scope, $http) {
	$scope.modules = [];
	$http.get(CATALOGUE_API_FORMAT).success(function(res) {
		$scope.modules = res;
	});
}