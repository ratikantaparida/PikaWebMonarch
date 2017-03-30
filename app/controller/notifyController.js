'use strict';
app.controller('notifyController', ['$scope', '$rootScope', '$filter', 'genericService', 'localStorageService', '$location', 'authService', function ($scope, $rootScope, $filter, genericService, localStorageService, $location, authService) {
    try {
        debugger;
        $scope.emsg = "";
        $scope.businessId = { "businessAccountId": authService.authentication.businessAccountId };
        $scope.dd_storeNames = [];
        $scope.consumerNames = [];
        $scope.notif = {};


        $scope.getConsumerList = function () {
            $scope.busymsg = "Getting Consumer List.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/test/consumerList", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.consumerNames = results.consumerDetailList;
                $scope.saveBusy = false;
            });
        }

        $scope.getStoreNames = function () {
            $scope.busymsg = "Getting Store Names.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/setup/getStoreNames", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.dd_storeNames = results;
                $scope.getConsumerList();
                $scope.saveBusy = false;
            });
        }
        $scope.getStoreNames();

        $scope.getId = function () {
            var abc = _.find($scope.dd_storeNames.storesList, { storeName: $scope.notif.title });
            $scope.notif.storeId = abc.storeId;
        };


        $scope.loadTags = function (query) {
            var tags = $scope.consumerNames;
            return tags;
        };

        $scope.sendNotif = function () {
            var notifUrl = "web/message/dataXmpp";
            if ($scope.notif.type == "SMS") {
                $scope.notif.message = $scope.notif.title + " - " + $scope.notif.message;
                delete $scope.notif.title;
                delete $scope.notif.storeId;
            }
            $scope.notif.mobileNumberList = _.map($scope.tags, 'mobileNumber');
            $scope.busymsg = "Sending Notification.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", notifUrl, $scope.notif, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.notifdata = results;
                $scope.saveBusy = false;
            });
        };


    }
    catch (e) { }
}]);