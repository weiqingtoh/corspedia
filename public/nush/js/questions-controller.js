function QuestionsController($scope) {

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
        	console.log($scope.name)
        	if (!$scope.name || $scope.name == undefined || $scope.name.length == 0) {
        		alert('Cluster mentor name not filled.');
        		return;
        	}
        	if (!$scope.cluster) {
        		alert('Cluster name not selected.');	
        		return;
        	}
        	if (!$scope.first_room || !$scope.second_room) {
        		alert('Room number not selected.');
        		return;
        	}
        }

        validation();

        if (!$scope.ignore_first_room && !$scope.ignore_first_room_left) {
        	var response = angular.copy($scope.individual_responses[0]);
        	$.extend(response, $scope.room_responses[0]);
        	$.extend(response, $scope.common_area_responses);
        	response['Room'] = $scope.cluster + '-' + formatRoom($scope.first_room) + '-1';
        	responses_to_submit.push(response);
        	objects_to_submit.push(new CleanlinessObject());
        }

        if (!$scope.ignore_first_room && !$scope.ignore_first_room_right) {
        	var response = angular.copy($scope.individual_responses[1]);
        	$.extend(response, $scope.room_responses[0]);
        	$.extend(response, $scope.common_area_responses);
        	response['Room'] = $scope.cluster + '-' + formatRoom($scope.first_room) + '-2';
        	responses_to_submit.push(response);
        	objects_to_submit.push(new CleanlinessObject());
        }

        if (!$scope.ignore_second_room && !$scope.ignore_second_room_left) {
        	var response = angular.copy($scope.individual_responses[2]);
        	$.extend(response, $scope.room_responses[1]);
        	$.extend(response, $scope.common_area_responses);
        	response['Room'] = $scope.cluster + '-' + formatRoom($scope.second_room) + '-1';
        	responses_to_submit.push(response);
        	objects_to_submit.push(new CleanlinessObject());
        }

        if (!$scope.ignore_second_room && !$scope.ignore_second_room_right) {
        	var response = angular.copy($scope.individual_responses[3]);
        	$.extend(response, $scope.room_responses[1]);
        	$.extend(response, $scope.common_area_responses);
        	response['Room'] = $scope.cluster + '-' + formatRoom($scope.second_room) + '-2';
        	responses_to_submit.push(response);
        	objects_to_submit.push(new CleanlinessObject());
        }

        $.map(responses_to_submit, function(res) {
        	res['Cluster_mentor'] = $scope.name;
        })
        
        var num_of_submitted_responses = 0;
        
        for (var i = 0; i < responses_to_submit.length; i++) {
	        objects_to_submit[i].save(
	        	responses_to_submit[i], {
	          	success: function(data) {
				    // Execute any logic that should take place after the object is saved.
				    num_of_submitted_responses++;
				    console.log(num_of_submitted_responses);
				    if (num_of_submitted_responses == responses_to_submit.length) {
					    alert('Responses submitted!');
					    location.reload();
					}
				},
				error: function(data, error) {
				    // Execute any logic that should take place if the save fails.
				    // error is a Parse.Error with an error code and description.
				    alert('Failed to submit response: ' + error.description);
				}
	        });
	    }
	}
}