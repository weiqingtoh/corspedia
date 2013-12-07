function CorspediaController($scope) {

	// bookmarks manager
	$scope.bookmarks_list = angular.fromJson(localStorage["bookmark_list"]);

	if (!$scope.bookmarks_list) {
		$scope.bookmarks_list = {};
		saveBookmarks();
	}

	$scope.addBookmark = function(module) {
		$scope.bookmarks_list[module] = module;
		saveBookmarks();
	}

	$scope.removeBookmark = function(module) {
		delete $scope.bookmarks_list[module];
		saveBookmarks();
	}

	function saveBookmarks() {
		localStorage["bookmark_list"] = angular.toJson($scope.bookmarks_list);
	}

	$scope.emptyBookmarks = function() {
		return Object.size($scope.bookmarks_list) === 0;
	}

	// search preferences
	$scope.preferences_list = angular.fromJson(localStorage["preferences_list"]);

	$scope.savePreferences = function() {
		localStorage["preferences_list"] = angular.toJson($scope.preferences_list);
	}

	$scope.emptyBookmarks = function() {
		return Object.size($scope.preferences_list) === 0;
	}
	
	if (!$scope.preferences_list) {
		$scope.preferences_list = { faculty: 0, newStudent: false, accType: 0 };
		$scope.savePreferences();
	}
}