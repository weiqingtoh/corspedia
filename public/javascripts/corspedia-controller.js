function CorspediaController($scope) {

	$scope.show_bookmarks_section = false;
	$scope.bookmarks_list = angular.fromJson(localStorage["bookmark_list"]);

	if (!$scope.bookmarks_list) {
		$scope.bookmarks_list = {};
		saveBookmarks();
	}

	$scope.toggleBookmarksSection = function() {
		$scope.show_bookmarks_section = !$scope.show_bookmarks_section; 
		if ($scope.show_bookmarks_section) {
			_gaq.push(['_trackEvent', 'Bookmarks', 'Open']);
		} else {
			_gaq.push(['_trackEvent', 'Bookmarks', 'Close']);
		}
	}

	$scope.addBookmark = function(module) {
		$scope.bookmarks_list[module] = module;
		$scope.show_bookmarks_section = true;
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