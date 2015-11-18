app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/directives/navbar/navbar.html',
        link: function (scope) {
            scope.user = null;
            
            scope.homestate = function() {
                return $rootScope.currentstate === "home" ? true : false;
            };

            scope.gamestate = function() {
                return $rootScope.currentstate === "game" ? true : false;
            };

            scope.loginstate = function() {
                return $rootScope.currentstate === "login" ? true : false;
            };
            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
