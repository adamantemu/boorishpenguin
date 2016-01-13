angular.module('boorish.profile', [])
  .controller('profileController', function($scope, Users){

    $scope.user = {}

    $scope.init= function(){
      Users.getUser().then(function(user) { // grabs the userID
        console.log(user)
      $scope.user = user; // adds the userID to the answer
      });
  }
    $scope.init()

//username, name, first & last names, is teacher? , points, email, photo
  });
