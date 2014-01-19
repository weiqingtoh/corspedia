function QuestionsController($scope) {

	$scope.loading_shown = false;

	// Loading of preferences
	if (localStorage['name']) {
		$scope.name = localStorage['name'];
	}

	// Saving of preferences
	if (localStorage['cluster']) {
		$scope.cluster = localStorage['cluster'];
	}

	$scope.savePreferences = function() {
		localStorage['name'] = $scope.name;
		localStorage['cluster'] = $scope.cluster;
	}

	$scope.saveCheckedRooms = function() {
		localStorage['rooms_checked'] = angular.toJson($scope.rooms_checked);
	}

	$scope.numberOfCheckedRooms = function() {
		return Object.keys($scope.rooms_checked).length;
	}

	if (localStorage['rooms_checked']) {
		$scope.rooms_checked = angular.fromJson(localStorage['rooms_checked']);
	} else {
		$scope.rooms_checked = {};
		$scope.saveCheckedRooms();
	}

	$scope.clearCheckedRooms = function() {
		if (!confirm('Are you sure you want to clear the checked rooms records?')) { return; }
		$scope.rooms_checked = {};
		$scope.saveCheckedRooms();
	}

	// Auto updating of room numbers
	$scope.changeRoom = function(num) {
		if (num == 'first') {
			var first_room = parseInt($scope.first_room);
			if (first_room % 2 == 1) {
				$scope.second_room = (first_room+1).toString();
			} else {
				$scope.second_room = (first_room-1).toString();
			}
		} else {
			var second_room = parseInt($scope.second_room);
			if (second_room % 2 == 1) {
				$scope.first_room = (second_room+1).toString();
			} else {
				$scope.first_room = (second_room-1).toString();
			}
		}
	}

	// Questions
	$scope.individual_questions = angular.copy(individual_questions);
	$scope.individual_responses = [{}, {}, {}, {}];

	for (var i = 0; i < $scope.individual_questions.length; i++) {
		for (var j = 0; j < 4; j++) {
			$scope.individual_responses[j][sanitizeQuestion($scope.individual_questions[i].question)] = "";
		}
	}

	$scope.editIndividualQuestionResponse = function(index, question, response) {
		$scope.individual_responses[index][sanitizeQuestion(question)] = response;
	}

	$scope.individualQuestionAnswered = function(index, question) {
		return $scope.individual_responses[index][sanitizeQuestion(question)] != '' ? 'answered' : '';
	}

	$scope.selectIndividualResponse = function(index, question, response) {
		return $scope.individual_responses[index][sanitizeQuestion(question)] == response ? 'selected': 'unselected';
	}


	$scope.room_questions = angular.copy(room_questions);
	$scope.room_responses = [{}, {}];

	for (var i = 0; i < $scope.room_questions.length; i++) {
		for (var j = 0; j < 2; j++) {
			$scope.room_responses[j][sanitizeQuestion($scope.room_questions[i].question)] = "";
		}
	}

	$scope.editRoomQuestionResponse = function(index, question, response) {
		$scope.room_responses[index][sanitizeQuestion(question)] = response;
	}

	$scope.roomQuestionAnswered = function(index, question) {
		return $scope.room_responses[index][sanitizeQuestion(question)] != '' ? 'answered' : '';
	}

	$scope.selectRoomResponse = function(index, question, response) {
		return $scope.room_responses[index][sanitizeQuestion(question)] == response ? 'selected': 'unselected';
	}

	$scope.common_area_questions = angular.copy(common_area_questions);
	$scope.common_area_responses = {};

	for (var i = 0; i < $scope.common_area_questions.length; i++) {
		for (var j = 0; j < $scope.common_area_questions[i].questions.length; j++) {
			$scope.common_area_responses[sanitizeQuestion($scope.common_area_questions[i].questions[j].question)] = "";
		}
	}

	$scope.editCommonAreaQuestionResponse = function(question, response) {
		$scope.common_area_responses[sanitizeQuestion(question)] = response;
	}

	$scope.commonAreaQuestionAnswered = function(question) {
		return $scope.common_area_responses[sanitizeQuestion(question)] != '' ? 'answered' : '';
	}

	$scope.selectCommonAreaResponse = function(question, response) {
		return $scope.common_area_responses[sanitizeQuestion(question)] == response ? 'selected': 'unselected';
	}


	$scope.submit = function() {	
		if (!confirm('Are you sure you want to submit the responses?')) { return; }

        var CleanlinessObject = Parse.Object.extend("CleanlinessObject");
        var objects_to_submit = [];
        
        var responses_to_submit = [];

        function formatRoom(num) {
        	return num < 10 ? '0' + num.toString() : num.toString();
        }

        function validation() {
        	if (!$scope.name || $scope.name == undefined || $scope.name.length == 0) {
        		alert('Cluster mentor name not filled.');
        		return true;
        	}
        	if (!$scope.cluster) {
        		alert('Cluster name not selected.');	
        		return true;
        	}
        	if (!$scope.first_room || !$scope.second_room) {
        		alert('Room number not selected.');
        		return true;
        	}
        }

        if (validation()) { return; }

        var rooms_checked_pending = [];

        if (!$scope.ignore_first_room && !$scope.ignore_first_room_left) {
        	var response = angular.copy($scope.individual_responses[0]);
        	$.extend(response, $scope.room_responses[0]);
        	$.extend(response, $scope.common_area_responses);
        	response['Room'] = $scope.cluster + '-' + formatRoom($scope.first_room) + '-1';
        	responses_to_submit.push(response);
        	objects_to_submit.push(new CleanlinessObject());
        	rooms_checked_pending.push(formatRoom($scope.first_room) + '-1');
        }

        if (!$scope.ignore_first_room && !$scope.ignore_first_room_right) {
        	var response = angular.copy($scope.individual_responses[1]);
        	$.extend(response, $scope.room_responses[0]);
        	$.extend(response, $scope.common_area_responses);
        	response['Room'] = $scope.cluster + '-' + formatRoom($scope.first_room) + '-2';
        	responses_to_submit.push(response);
        	objects_to_submit.push(new CleanlinessObject());
        	rooms_checked_pending.push(formatRoom($scope.first_room) + '-2');
        }

        if (!$scope.ignore_second_room && !$scope.ignore_second_room_left) {
        	var response = angular.copy($scope.individual_responses[2]);
        	$.extend(response, $scope.room_responses[1]);
        	$.extend(response, $scope.common_area_responses);
        	response['Room'] = $scope.cluster + '-' + formatRoom($scope.second_room) + '-1';
        	responses_to_submit.push(response);
        	objects_to_submit.push(new CleanlinessObject());
        	rooms_checked_pending.push(formatRoom($scope.second_room) + '-1');
        }

        if (!$scope.ignore_second_room && !$scope.ignore_second_room_right) {
        	var response = angular.copy($scope.individual_responses[3]);
        	$.extend(response, $scope.room_responses[1]);
        	$.extend(response, $scope.common_area_responses);
        	response['Room'] = $scope.cluster + '-' + formatRoom($scope.second_room) + '-2';
        	responses_to_submit.push(response);
        	objects_to_submit.push(new CleanlinessObject());
        	rooms_checked_pending.push(formatRoom($scope.second_room) + '-2');
        }

        $.map(responses_to_submit, function(res) {
        	res['Cluster_mentor'] = $scope.name;
        })
        
        var num_of_submitted_responses = 0;
        $scope.loading_shown = true;
        for (var i = 0; i < responses_to_submit.length; i++) {
	        objects_to_submit[i].save(
	        	responses_to_submit[i], {
	          	success: function(data) {
				    // Execute any logic that should take place after the object is saved.
				    num_of_submitted_responses++;
				    console.log(num_of_submitted_responses);
				    if (num_of_submitted_responses == responses_to_submit.length) {
					    for (var i = 0; i < rooms_checked_pending.length; i++) {
				    		$scope.rooms_checked[rooms_checked_pending[i]] = rooms_checked_pending[i];
				    	}
				    	$scope.loading_shown = false;	
				    	$scope.saveCheckedRooms();
					    alert('Responses submitted!');
					    location.reload();
					}
				},
				error: function(data, error) {
				    // Execute any logic that should take place if the save fails.
				    // error is a Parse.Error with an error code and description.
				    alert('Failed to submit response: ' + error.description);
				    $scope.loading_shown = false;
				}
	        });
	    }
	}
}