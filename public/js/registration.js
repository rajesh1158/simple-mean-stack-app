// define angular module/app
var formApp = angular.module('registrationFormApp', []);

// create angular controller and pass in $scope and $http
formApp.controller('registrationFormController', ['$scope', '$http', '$window', function($scope, $http, $window) {
	// create a blank object to hold our form information
	// $scope will allow this to pass between controller and view
	$scope.registrationFormData = {};
	// process the form
	$scope.submitRegistration = function() {
		$scope.errorMessage = '';
		if($scope.registrationFormData.password !== $scope.registrationFormData.confirmpassword) {
			$scope.errorMessage = 'Passwords do not match';
			return;
		}

		$http({
	        method: 'POST',
	        url: '/registration',
	        data: $.param($scope.registrationFormData),  // pass in data as strings
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
	    }).then(function(response) {
            if(!response.data.success) {
            	// if not successful, bind errors to error variables
                $scope.errorMessage = response.data.error;
            } else {
                $scope.errorMessage = '';
				$window.location.href = '/index.html';
            }
		}, function(response) {
			$scope.errorMessage = response.data.error;
		});
	};
}]);
