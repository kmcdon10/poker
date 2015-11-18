app.factory('CardFactory', function(DS) {
  return DS.defineResource({
    name: 'cards',
  });
}).run(function(CardFactory) {
  CardFactory.findAll();
});
