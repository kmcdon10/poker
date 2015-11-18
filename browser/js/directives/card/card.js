app.directive('card', () => {
  return {
    restrict: 'E',
    scope: {
      card: '='
    },
    templateUrl: '/js/directives/card/card.html',
    link: (scope, el) => {
      angular.element(document).ready(function() {
        $(el).show('slow');
      });
    }
  };
});
