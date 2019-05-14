// define angular module/app
var formApp = angular.module('loginFormApp', []);

// create angular controller and pass in $scope and $http
formApp.controller('loginFormController', ['$scope', '$http', '$window', function($scope, $http, $window) {
	// create a blank object to hold our form information
	// $scope will allow this to pass between controller and view
	$scope.loginFormData = {};
	// process the form
	$scope.submitLogin = function() {
		$scope.errorMessage = '';
		$http({
	        method: 'POST',
	        url: '/login',
	        data: $.param($scope.loginFormData),  // pass in data as strings
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
	    }).then(function(response) {
            if(!response.data.success) {
            	// if not successful, bind errors to error variables
                $scope.errorMessage = response.data.error;
            } else {
                $scope.errorMessage = '';
				$window.location.href = '/home';
            }
		}, function(response) {
			$scope.errorMessage = response.data.error;
		});
	};
}]);
