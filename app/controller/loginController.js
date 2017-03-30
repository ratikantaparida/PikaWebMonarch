'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'localStorageService', 'genericService', function ($scope, $location, authService, localStorageService, genericService) {
    debugger;
    $scope.loginData = {
        email: "",
        password: ""
    };
    $scope.busymsg = "form is loading Please wait..";
    $scope.message = "";
    $scope.login = function () {
        debugger;
        $scope.saveBusy = true;
        $scope.myPromise = authService.login($scope.loginData);
        $scope.myPromise.then(function (response, err) {
            debugger;
            $location.path('/overview');
        },
          function (err) {
              $scope.credentials = err.genericResponse;
          });

    };
}]);