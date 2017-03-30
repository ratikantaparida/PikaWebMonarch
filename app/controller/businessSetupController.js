'use strict';
app.controller('businessSetupController', ['$scope', '$routeParams', '$filter', 'genericService', 'localStorageService', '$location', 'authService', function ($scope, $routeParams, $filter, genericService, localStorageService, $location, authService) {
    try {
        debugger;
        $scope.emsg = "";
        $scope.STORE_ID = $routeParams.store_ID;

        $scope.EDIT = false;
        $scope.dd_currency = [];
        $scope.selCurrency = {};
        $scope.dd_timezone = [];
        $scope.selTimezone = {};
        $scope.dd_city = [];
        $scope.dd_prodomain = [];
        $scope.selCity0 = {};
        $scope.selCity1 = {};
        $scope.dd_storetype = [];
        $scope.selStoretype = {};
        $scope.imgData = '';
        
        $scope.businessId = { "businessAccountId": authService.authentication.businessAccountId };
        
        $scope.businessData = {
				"businessAccountId" : 0,
				"accountName" : "",
				"accountCode" : "",
				"privateUrl" : "",
				"organisationId" : 0,
				"businessAccountTypeId" : 0,
				"businessAccountTypeName" : "",
				"productDomainId" : 0,
				"productDomainName" : "",
				"currencyId" : 0,
				"currencyDesc" : "",
				"subscriptionModelId" : 0,
				"subscriptionModelName" : "",
				"timezoneId" : 0,
				"timezoneDesc" : "",
				"contactNumber" : 0,
				"colorCode" : "",
				"contactFirstName" : "",
				"contactLastName" : "",
				"email" : "",
				"facebookUrl" : "",
				"website" : "",
				"twitterUrl" : "",
				"imageUrl" : ""
		};
        
        
        $scope.saveBiz = function () {
       	 debugger;
       	 delete $scope.businessData.genericResponse;
	    	 $scope.businessData.currencyId=$scope.selCurrency.id;
	    	 delete $scope.businessData.currencyDesc;
	    	 $scope.businessData.timezoneId=$scope.selTimezone.id;
	    	 delete $scope.businessData.timezoneDesc;	    	 
	    	 $scope.businessData.productDomainId=$scope.selProductDomainName.productDomainId;
	    	 delete $scope.businessData.productDomainName;    	 
	    	 $scope.businessData.businessAccountTypeId=$scope.selBusinessAccountType.businessAccountTypeId;
	    	 delete $scope.businessData.businessAccountTypeName;	       	 
	    	 $scope.businessData.subscriptionModelId=$scope.selSubscriptionModel.subscriptionModelId;
	    	 delete $scope.businessData.subscriptionModelName;
	    	 $scope.businessData.businessAccountId = authService.authentication.businessAccountId;
	       	 console.log($scope.businessData); 
	       	
	         $scope.myPromise = genericService.genericFunction("POST", "web/setup/saveBusinessSetup", $scope.businessData, 0);
	            $scope.myPromise.then(function (results) {
	                debugger;
	                $scope.saveBusinessResponse = results;
	                $scope.getBusinessData();
	                $scope.saveBusy = false;
	            });
	         
	            
	     };
        
        $scope.getBusinessData = function () {
            $scope.busymsg = "Getting Business Details.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/setup/getBusinessSetup", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.businessData = results;
                $scope.selCurrency = $scope.dd_currency[_.findIndex($scope.dd_currency, function (o) { return o.id == $scope.businessData.currencyId; })];
                $scope.selTimezone = $scope.dd_timezone[_.findIndex($scope.dd_timezone, function (o) { return o.id == $scope.businessData.timezoneId; })];
                $scope.selStoretype = $scope.dd_storetype[_.findIndex($scope.dd_storetype, function (o) { return o.id == $scope.businessData.storeTypeId; })];
                $scope.selProductDomainName = $scope.dd_prodomain[_.findIndex($scope.dd_prodomain, function (o) { return o.productDomainId == $scope.businessData.productDomainId; })];
                $scope.selBusinessAccountType = $scope.dd_biztype[_.findIndex($scope.dd_biztype, function (o) { return o.businessAccountTypeId == $scope.businessData.businessAccountTypeId; })];
                $scope.selSubscriptionModel = $scope.dd_subscribe[_.findIndex($scope.dd_subscribe, function (o) { return o.subscriptionModelId == $scope.businessData.subscriptionModelId; })];
                $scope.saveBusy = false;
            });
        }
        $scope.getBusinessData();

        $scope.getCurrency = function () {
            var currencyLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + '_currency_lscache');
            if (currencyLS == null) {
                $scope.busymsg = "Getting Currency List.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/rules/getAllCurrency", {}, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.dd_currency = results.items;
                    var pdata = { id: 0, currencyDesc: "Please Select", currencyCode: '' };
                    $scope.dd_currency.splice(0, 0, pdata);
                    $scope.selCurrency = $scope.dd_currency[0];
                    localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + '_currency_lscache', $scope.dd_currency);
                    $scope.saveBusy = false;
                    if ($scope.STORE_ID != 0) {
                        $scope.getProductDomain();
                        $scope.EDIT = false;
                    }
                });
            }
            else {
                $scope.dd_currency = currencyLS;
                $scope.selCurrency = $scope.dd_currency[0];
                if ($scope.STORE_ID != 0) {
                    $scope.getProductDomain();
                    $scope.EDIT = false;
                }
            }
        }

        $scope.getTimeZone = function () {
            var timeZoneLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + '_timeZone_lscache');
            if (timeZoneLS == null) {
                $scope.busymsg = "Getting Time Zone.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/rules/getAllTimezone", {}, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.dd_timezone = results.items;
                    var pdata = { id: 0, timezoneDesc: "Please Select", timezoneCode: '' };
                    $scope.dd_timezone.splice(0, 0, pdata);
                    $scope.selTimezone = $scope.dd_timezone[0];
                    $scope.saveBusy = false;
                    localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + '_timeZone_lscache', $scope.dd_timezone);
                    $scope.getCurrency();
                });
            }
            else {
                $scope.dd_timezone = timeZoneLS;
                $scope.selTimezone = $scope.dd_timezone[0];
                $scope.getCurrency();
            }
        }

        $scope.getCities = function () {
            var cityLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + '_city_lscache');
            if (cityLS == null) {
                $scope.busymsg = "Getting Cities.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/rules/getAllCities", {}, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.dd_city = results.items;
                    var pdata = { id: 0, cityName: "Please Select" };
                    $scope.dd_city.splice(0, 0, pdata);
                    $scope.selCity0 = $scope.dd_city[0];
                    $scope.selCity1 = $scope.dd_city[0];
                    $scope.saveBusy = false;
                    localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + '_city_lscache', $scope.dd_city);
                    $scope.getTimeZone();
                });
            }
            else {
                $scope.dd_city = cityLS;
                $scope.selCity0 = $scope.dd_city[0];
                $scope.selCity1 = $scope.dd_city[0];
                $scope.getTimeZone();
            }
        }

        $scope.getProductDomain = function () {
            var productDomainLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + '_productDomain_lscache');
            if (productDomainLS == null) {
                $scope.busymsg = "Getting Product Domains.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/setup/getAllProductDomain", {}, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.dd_prodomain = results.productDomainList;
                    var pdata = { productDomainId: 0, productDomainName: "Please Select" };
                    $scope.dd_prodomain.splice(0, 0, pdata);
                    $scope.selProductDomainName = $scope.dd_prodomain[0];
                    $scope.saveBusy = false;
                    localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + '_productDomain_lscache', $scope.dd_prodomain);
                    $scope.getCities();
                });
            }
            else {
                $scope.dd_prodomain = productDomainLS;
                $scope.selProductDomainName = $scope.dd_prodomain[0];
                $scope.getCities();
            }
        }
        
        $scope.getBusinessAccountType = function () {
            var businessAccountLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + '_businessAccountType_lscache');
            if (businessAccountLS == null) {
                $scope.busymsg = "Getting Business Account Types.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/setup/getAllBusinessAccountType", {}, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.dd_biztype = results.businessAccountTypeList;
                    var pdata = { businessAccountTypeId: 0, businessAccountTypeName: "Please Select" };
                    $scope.dd_biztype.splice(0, 0, pdata);
                    $scope.selBusinessAccountType = $scope.dd_biztype[0];
                    $scope.saveBusy = false;
                    localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + '_businessAccountType_lscache', $scope.dd_biztype);
                    $scope.getProductDomain();
                });
            }
            else {
                $scope.dd_biztype = businessAccountLS;
                $scope.selBusinessAccountType = $scope.dd_biztype[0];
                $scope.getProductDomain();
            }
        }
        
        $scope.getAllSubscriptionModel = function () {
            var subscriptionModelLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + '_subscriptionModelType_lscache');
            if (subscriptionModelLS == null) {
                $scope.busymsg = "Getting Subscription Model Types.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/setup/getAllSubscriptionModel", {}, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.dd_subscribe = results.subscriptionModelList;
                    var pdata = { subscriptionModelId: 0, subscriptionModelName: "Please Select" };
                    $scope.dd_subscribe.splice(0, 0, pdata);
                    $scope.selSubscriptionModel = $scope.dd_subscribe[0];
                    $scope.saveBusy = false;
                    localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + '_subscriptionModelType_lscache', $scope.dd_subscribe);
                    $scope.getBusinessAccountType();
                });
            }
            else {
                $scope.dd_subscribe = subscriptionModelLS;
                $scope.selSubscriptionModel = $scope.dd_subscribe[0];
                $scope.getBusinessAccountType();
            }
        }
        
        $scope.getAllSubscriptionModel();
       
        
    }
    catch (e) { }
}]);