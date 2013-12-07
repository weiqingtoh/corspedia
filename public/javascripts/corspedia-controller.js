function CorspediaController($scope) {

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
}