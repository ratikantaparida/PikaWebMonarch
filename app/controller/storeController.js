'use strict';
app.controller('storeController', ['$scope', '$rootScope', '$filter', 'genericService', 'localStorageService', '$location', 'authService', function ($scope, $rootScope, $filter, genericService, localStorageService, $location, authService) {
    try {
        debugger;
        $scope.emsg = "";
        $scope.orderByField = 'fdate';
        $scope.reverseSort = false;
        $scope.filterData = '';
        $scope.tableData = [];
        $scope.storeData = [];
        $scope.businessId = { "businessAccountId": authService.authentication.businessAccountId };

        $scope.getStoreData = function () {
            $scope.busymsg = "Getting Stores Details.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/test/getStoreStats", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.storeData = results.storeStats;
                $scope.saveBusy = false;
            });
        }
        $scope.getStoreData();

        ////////////////////////

        $scope.adEditStore = function (storeId) {
            $location.path("/storewizard/storeId/" + storeId);
        }

        $scope.removeStore = function (storeId) {
            var strconfirm = confirm("Are you sure you want to remove this store?");
            if (strconfirm == true) {
                $scope.busymsg = "Removing Store.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/setup/removeStore", {}, storeId);
                $scope.myPromise.then(function (results) {
                    $scope.removeStoreDetails = results;
                    $scope.saveBusy = false;
                    $scope.getStoreData();
                });
            }
        }
    }
    catch (e) { }
}]);