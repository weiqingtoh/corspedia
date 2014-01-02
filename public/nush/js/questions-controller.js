function QuestionsController($scope) {
	

	$scope.individual_questions = angular.copy(individual_questions);
	$scope.individual_responses = [{}, {}, {}, {}];

	for (var i = 0; i < $scope.individual_questions.length; i++) {
		for (var j = 0; j < 4; j++) {
			$scope.individual_responses[j][sanitizeQuestion($scope.individual_questions[i].question)] = "";
		}
	}

	function sanitizeQuestion(question) {
		return question.replace(/ /g, "_").replace(/\?/g, "");
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

        var ResObject = Parse.Object.extend("ResponseObject");
        var resObject = new ResObject();

        resObject.save(
        	$scope.responses, {
          	success: function(data) {
			    // Execute any logic that should take place after the object is saved.
			    alert('Response Submitted!');
			  },
			  error: function(data, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and description.
			    alert('Failed to submit response: ' + error.description);
			  }
        });
	}
}