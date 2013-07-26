'use strict';

angular.module('corspediaResults', [], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{@');
    $interpolateProvider.endSymbol('@}');
}); 

var QUERY_URL_FORMAT = '/query?code=<modCode>&fac=<faculty>&acc=<accType>&new=<newStudent>';
var RESULTS_URL_FORMAT = '/results?code=<modCode>&fac=<faculty>&acc=<accType>&new=<newStudent>';

function ResultsController($scope, $http, $timeout) {

	$scope.modCode = modCode.toUpperCase();
	$scope.faculty = faculty.toUpperCase();
	$scope.accType = accType;
	$scope.newStudent = newStudent.toString();
	$scope.loading = true;
	$scope.error = false;
	$scope.loading_section = {'loading-screen': true, 'invisible': !$scope.loading};
	$scope.results_section = {'main-container': true, 'invisible': $scope.loading};
	$scope.empty_data = true;

	$scope.show_search_section = false;

	$scope.toggleSearchContainer = function() {

		$('#search-container').toggle("blind");
		$scope.show_search_section = !$scope.show_search_section; 
		if ($scope.show_search_section) {
			_gaq.push(['_trackEvent', 'Search', 'Open']);
		} else {
			_gaq.push(['_trackEvent', 'Search', 'Close']);
		}
		
	}

	function constructURL(type, mod, fac, acc, stu) {
		var format = type == 'query' ? QUERY_URL_FORMAT : RESULTS_URL_FORMAT;
		var m = mod ? mod : $scope.modCode;
		var f = fac ? fac : $scope.faculty;
		var a = acc ? acc : $scope.accType;
		var s = stu ? stu : $scope.newStudent;
		return format.replace('<modCode>', m).
						replace('<faculty>', f).
						replace('<accType>', a).
						replace('<newStudent>', s);				
	}

	$scope.newSearch = function(module) {
		var new_url = constructURL('results', module);
		window.location = new_url;
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
		return string;
	};

	function fetchResults() {
		$scope.loading = true;
		$http.get(constructURL('query')).success(function(res) {
			$scope.data = res;
			// console.log(res);
			if ($scope.data.module_error || $scope.data.faculty_error) {
				$scope.loading = false;
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

	$scope.show_bookmarks_section = false;
	$scope.bookmarks_list = angular.fromJson(localStorage["bookmark_list"]);

	if ($scope.bookmarks_list === null) {
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
		return Object.keys($scope.bookmarks_list).length === 0;
	}

	$scope.moduleInBookmarks = function() {
		return $scope.modCode in $scope.bookmarks_list;
	}
}