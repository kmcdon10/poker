app.directive('cardback', () => {
  return {
    restrict: 'E',
    scope: {
      card: '='
    },
    templateUrl: '/js/directives/card/cardback.html',
    link: (scope, el) => {
      angular.element(document).ready(function() {
        $(el).show('slow');
      });
    }
  };
});
