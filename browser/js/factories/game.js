app.factory('GameFactory', DS => {
  return DS.defineResource({
    name: 'games',
  });
}).run(GameFactory => {});
