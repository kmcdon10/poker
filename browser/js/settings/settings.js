app.config(function($stateProvider) {
  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'js/settings/settings.html',
    controller: 'UserSettingsController',
    resolve: {
      user: function(AuthService) {
        return AuthService.getLoggedInUser();
      }
    },
    data: {
        authenticate: true
    }
  });
});

app.controller('UserSettingsController', function($scope, user, UserFactory) {
  $scope.user = user;
  $scope.count = 1;
  $scope.toggleviewcards = true;


  $scope.updateUser = function(userInfo) {
    for (var key in $scope.user){
      for (var prop in userInfo){
        if (key == prop) {
          $scope.user[key] = userInfo[prop];
        }
      }
    }
    UserFactory.update($scope.user._id, $scope.user)
    .then(function(updateUser){
    })
    .then(null, function(err){
      console.log("error occured ", err);
    });
  };

  $scope.removeDeck = function() {
    // allow user to delete one of their decks
  };

  $scope.addDeck = function() {
    // allow user to create a new deck
  };


});