'use strict';
app.controller('campaignController', ['$scope', '$rootScope', '$filter', 'genericService', 'localStorageService', '$location','authService', function ($scope, $rootScope, $filter, genericService, localStorageService, $location, authService) {
    try {
        debugger;
        $scope.emsg = "";
        $scope.orderByField = 'fdate';
        $scope.reverseSort = false;
        $scope.tableData = [];
        $scope.campOverview = {};
        $scope.consumerBreakupTags = {};
        $scope.consumerBreakupBadge = {};
        $scope.campaignData = {};
        $scope.businessId = { "businessAccountId": authService.authentication.businessAccountId };
        
        $scope.getCampaignOverview = function () {
            $scope.busymsg = "Getting Campaign Details.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/campaign/campaignOverview", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.campOverview = results;
                $scope.consumerBreakupTags = results.consumerBreakup.activityTagBreakupList;
                $scope.consumerBreakupBadge = results.consumerBreakup.badgeBreakupList;
                $scope.campaignData = results.campaignData;
                $scope.saveBusy = false;
            });
        }
        $scope.getCampaignOverview();
        
        $scope.cDetailsPopup = function (cdata) {
            debugger;
            $scope.display = cdata;
            $scope.targetGroup = JSON.parse(cdata.targetGroup);
            $("#myModal").modal('show');
        }
        
        $scope.goToCreateCampaign = function () {
        	$location.path( "/wizard" );
        }
        
        $scope.stopCampaign = function (campaignId) {
        	$scope.busymsg = "Stopping Campaign.. Please Wait"
            $scope.saveBusy = true;
        	var request = { "campaignId": campaignId };
        	$scope.myPromise = genericService.genericFunction("POST", "web/campaign/stopCampaignDelivery", request, 0);      	
        	$scope.myPromise.then(function (results) {
                debugger;
                $scope.stop = results;
                console.log(results);
                if(results.apiSuccessStatus==false)
	            {
	            	$scope.oops=true;
	            }
	            else if(results.apiSuccessStatus==true)
	            {
	            	$scope.voila=true;
	            }
                $scope.saveBusy = false;
            });    	
       }
        
       $scope.alertPop = function () {
    	   $scope.getCampaignOverview(); 
       } 
        
    }
    catch (e) { }
}]);