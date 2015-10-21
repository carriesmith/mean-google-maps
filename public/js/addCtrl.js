// Creates the addCtrl Module and Controller
// Note that it depends on the 'geolocation' module and service
var addCtrl = angular.module('addCtrl', ['geolocation']);

addCtrl.controller('addCtrl', function($scope, $http, geolocation){

  $scope.formData = {};
  var coords = {};
  var lat = 0;
  var long = 0;

  // set initial coordinates to the center of the US
  $scope.formData.latitude = 39.500;
  $scope.formData.longitude = -98.350;

  // Functions
  // --------------------------------
  // Creates a new user based on the form fields
  $scope.createUser = function() {

    // grabs all fo the text box fields
    var userData = {
      username: $scope.formData.username,
      gender: $scope.formData.gender,
      age: $scope.formData.age,
      favlang: $scope.formData.favlang,
      location: [$scope.formData.longitude, $scope.formData.latitude],
      htmlverified: $scope.formData.htmlverified
    };

    // saves the user data to the db
    $http.post('/users', userData)
      .success(function(data){
        // once complete, clear the form (except location)
        $scope.formData.username = '';
        $scope.formData.gender = '';
        $scope.formData.age = '';
        $scope.formData.favlang = '';

      })
      .error(function(data){
        console.log('Error: ' + data);
      });

  };

});