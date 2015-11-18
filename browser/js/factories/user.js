app.factory('UserFactory', function(DS) {
  return DS.defineResource({
    name: 'users',
  });
}).run(function(UserFactory) {
  UserFactory.findAll();
});
