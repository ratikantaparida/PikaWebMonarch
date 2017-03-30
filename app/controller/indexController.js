'use strict';
app.controller('indexController', ['$scope', '$location', 'authService', '$window', function ($scope, $location, authService, $window) {
    $scope.newMsg = false;
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
   
    $scope.logOut = function () {
        authService.logOut();
        $location.path('/login');
    }
    $scope.refreshApp = function () {
        debugger;
        $window.localStorage.clear();
        $scope.logOut();
    }
    $scope.authentication = authService.authentication;

  

}]);