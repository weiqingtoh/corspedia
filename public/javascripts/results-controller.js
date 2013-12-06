'use strict';

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

var QUERY_URL_FORMAT = '/query?code=<modCode>&fac=<faculty>&acc=<accType>&new=<newStudent>';
var RESULTS_URL_FORMAT = '/results?code=<modCode>&fac=<faculty>&acc=<accType>&new=<newStudent>';

function ResultsController($scope, $http, $timeout) {

	$scope.modCode = modCode.toUpperCase();
	$scope.currentModCode = $scope.modCode;
	$scope.faculty = faculty.toUpperCase();
	$scope.accType = accType;
	$scope.newStudent = newStudent.toString();
	$scope.loading = true;
	$scope.error = false;
	$scope.suggestion = '';
	$scope.loading_section = {'loading-screen': true, 'invisible': !$scope.loading};
	$scope.results_section = {'main-container': true, 'invisible': $scope.loading};
	$scope.empty_data = true;

	$scope.show_search_section = false;
	console.log('results contr')
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
			console.log(res);

			function suggestModule(str, suggest_list){
				if (str && suggest_list){
					for (var i = 0; i <= suggest_list.length-1; i++) {
						str = str.insert(str.length,'<a class="module-links" href="http://www.corspedia.com');
						str = str.insert(str.length, constructURL('results', suggest_list[i]) + '">');
						str = str.insert(str.length, suggest_list[i] + '</a>  ');
						if (i == suggest_list.length - 2){
							str = str + ' or ';
						} else if (i == suggest_list.length - 1){
							str = str + '?';
						} else {
							str = str + ', '
						}
					}
				}
				return str;
			}

			if ($scope.data.error.module || $scope.data.error.faculty) {
				$scope.loading = false;
				$scope.error = true;

				if ($scope.data.suggestion) {
					$scope.suggestion = suggestModule('Were you looking for ', $scope.data.suggestion); 
				}

				return;
			}

			function linkifyModules(str, module_list) {
				if (str && module_list) {
					for (var i = module_list.length - 1; i >= 0; i--) {
						var starting_index = module_list[i][0];
						var length = module_list[i][1];
						var ending_index = starting_index + length;
						var module_code = str.substr(starting_index, length);
						str = str.insert(ending_index, '</a>');
						str = str.insert(starting_index, '<a class="module-links" href="' + constructURL('results', module_code) + '">');
						console.log(module_code);
					}
				}
				return str;
			}

			$scope.data.prerequisite = linkifyModules($scope.data.prerequisite, $scope.data.prerequisite_module);
			$scope.data.preclusion = linkifyModules($scope.data.preclusion, $scope.data.preclusion_module);

			for (var i = 0; i < $scope.data.bid_history_by_year.length; i++) {
				if ($scope.data.bid_history_by_year[i].data.length > 0) {
					$scope.empty_data = false;
					break;
				}
			}
			$timeout(function() {
				if (!$scope.empty_data) {
					$timeout(function() {
						$("#bidding-history-table").tabs();
					}, 0);
				}
				$timeout(function() {
					$scope.loading = false;
					syncLoadingState();
				}, 250)
			});
		}).error(function(res) {
			$scope.error = true;
		});
	}

	fetchResults();

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
		console.log($scope.bookmarks_list);
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

	$scope.moduleInBookmarks = function() {
		for (var key in $scope.bookmarks_list) {
			if ($scope.bookmarks_list.hasOwnProperty(key) && $scope.currentModCode === key) {
				return true;
			}
		}
		return false;
	}
}