'use strict';
app.controller('storewizardController', ['$scope', '$routeParams', '$filter', 'genericService', 'localStorageService', '$location', 'authService', function ($scope, $routeParams, $filter, genericService, localStorageService, $location, authService) {
    try {
        debugger;
        $scope.emsg = "";
        $scope.STORE_ID = $routeParams.store_ID;

        $scope.EDIT = true;
        $scope.dd_currency = [];
        $scope.selCurrency = {};
        $scope.dd_timezone = [];
        $scope.selTimezone = {};
        $scope.dd_city = [];
        $scope.selCity0 = {};
        $scope.selCity1 = {};
        $scope.dd_storetype = [];
        $scope.selStoretype = {};
        $scope.copyCheck = false;
        $scope.imgData = '';

        $scope.storeData = {
            "storeName": "",
            "storeTypeId": 0,
            "storeTypeName": "",
            "privateUrl": '',
            "currencyId": 0,
            "currencyDesc": "",
            "timezoneId": 0,
            "timezoneDesc": "",
            "contactName": '',
            "email": '',
            "contactNumber": '',
            "website": '',
            "twitter_Url": '',
            "imageUrl": "",
            "items": [
              {
                  "addressLine1": '',
                  "addressLine2": '',
                  "suburb": '',
                  "latitude": '',
                  "longitude": '',
                  "zipCode": '',
                  "type": "PHYSICAL",
                  "cityId": 0,
                  "cityName": "",
                  "stateName": "",
                  "countryName": ""
              },
              {
                  "addressLine1": '',
                  "addressLine2": '',
                  "suburb": '',
                  "latitude": '',
                  "longitude": '',
                  "zipCode": '',
                  "type": "POSTAL",
                  "cityId": 0,
                  "cityName": "",
                  "stateName": "",
                  "countryName": ""
              }
            ]
        };
        $scope.deviceData = [];
        $scope.getDeviceData = function () {
            $scope.busymsg = "Getting Devices Attached To Store.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("GET", "web/setup/getAllStoreDevices", {}, $scope.STORE_ID);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.deviceData = results.deviceList;
                $scope.saveBusy = false;
            });
        }

        $scope.getStoreData = function () {
            $scope.busymsg = "Getting Store Details.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/setup/getStoreDetails", { "storeId": $scope.STORE_ID }, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.storeData = results;
                $scope.selCity0 = $scope.dd_city[_.findIndex($scope.dd_city, function (o) { return o.id == $scope.storeData.items[0].cityId; })];
                $scope.selCity1 = $scope.dd_city[_.findIndex($scope.dd_city, function (o) { return o.id == $scope.storeData.items[1].cityId; })];
                $scope.selCurrency = $scope.dd_currency[_.findIndex($scope.dd_currency, function (o) { return o.id == $scope.storeData.currencyId; })];
                $scope.selTimezone = $scope.dd_timezone[_.findIndex($scope.dd_timezone, function (o) { return o.id == $scope.storeData.timezoneId; })];
                $scope.selStoretype = $scope.dd_storetype[_.findIndex($scope.dd_storetype, function (o) { return o.id == $scope.storeData.storeTypeId; })];
                $scope.saveBusy = false;
                $scope.getDeviceData();
            });
        }

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
                        $scope.getStoreData();
                        $scope.EDIT = false;
                    }
                });
            }
            else {
                $scope.dd_currency = currencyLS;
                $scope.selCurrency = $scope.dd_currency[0];
                if ($scope.STORE_ID != 0) {
                    $scope.getStoreData();
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

        $scope.getStoreType = function () {
            var storeTypeLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + '_storeType_lscache');
            if (storeTypeLS == null) {
                $scope.busymsg = "Getting Store Types.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/setup/getAllStoreType", {}, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.dd_storetype = results.storetypeList;
                    var pdata = { id: 0, storeType: "Please Select" };
                    $scope.dd_storetype.splice(0, 0, pdata);
                    $scope.selStoretype = $scope.dd_storetype[0];
                    $scope.saveBusy = false;
                    localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + '_storeType_lscache', $scope.dd_storetype);
                    $scope.getCities();
                });
            }
            else {
                $scope.dd_storetype = storeTypeLS;
                $scope.selStoretype = $scope.dd_storetype[0];
                $scope.getCities();
            }
        }

        $scope.getStoreType();

        $scope.getSC0 = function () {
            if ($scope.selCity0.id != 0) {
                $scope.storeData.items[0].cityName = $scope.selCity0.cityName;
                $scope.storeData.items[0].cityId = $scope.selCity0.id;
                var scLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + 'cityId_' + $scope.selCity0.id + '_statecountry_lscache');
                if (scLS == null) {
                    var sendCity = { "cityId": $scope.selCity0.id };
                    $scope.busymsg = "Getting State.. Please Wait.."
                    $scope.saveBusy = true;
                    $scope.myPromise = genericService.genericFunction("POST", "web/setup/getStateandCountry", sendCity, 0);
                    $scope.myPromise.then(function (results) {
                        debugger;
                        $scope.getSCDetails = results;
                        $scope.storeData.items[0].stateName = results.stateName;
                        $scope.storeData.items[0].countryName = results.countryName;
                        localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + 'cityId_' + $scope.selCity0.id + '_statecountry_lscache', results);
                        $scope.saveBusy = false;
                    });
                }
                else {
                    $scope.storeData.items[0].stateName = scLS.stateName;
                    $scope.storeData.items[0].countryName = scLS.countryName;
                }
            }
            else {
                $scope.storeData.items[0].cityName = '';
                $scope.storeData.items[0].cityId = 0;
                $scope.storeData.items[0].stateName = '';
                $scope.storeData.items[0].countryName = '';
            }
        }

        $scope.getSC1 = function () {
            if ($scope.selCity1.id != 0) {
                $scope.storeData.items[1].cityName = $scope.selCity1.cityName;
                $scope.storeData.items[1].cityId = $scope.selCity1.id;
                var scLS = localStorageService.get('BusinessId_' + authService.authentication.businessAccountId + 'cityId_' + $scope.selCity1.id + '_statecountry_lscache');
                if (scLS == null) {
                    var sendCity = { "cityId": $scope.selCity1.id };
                    $scope.busymsg = "Getting State.. Please Wait.."
                    $scope.saveBusy = true;
                    $scope.myPromise = genericService.genericFunction("POST", "web/setup/getStateandCountry", sendCity, 0);
                    $scope.myPromise.then(function (results) {
                        debugger;
                        $scope.getSCDetails = results;
                        $scope.storeData.items[1].stateName = results.stateName;
                        $scope.storeData.items[1].countryName = results.countryName;
                        localStorageService.set('BusinessId_' + authService.authentication.businessAccountId + 'cityId_' + $scope.selCity1.id + '_statecountry_lscache', results);
                        $scope.saveBusy = false;
                    });
                }
                else {
                    $scope.storeData.items[1].stateName = scLS.stateName;
                    $scope.storeData.items[1].countryName = scLS.countryName;
                }
            }
            else {
                $scope.storeData.items[1].cityName = '';
                $scope.storeData.items[1].cityId = 0;
                $scope.storeData.items[1].stateName = '';
                $scope.storeData.items[1].countryName = '';
            }
        }

        $scope.copyPAddress = function () {
            debugger;
            if ($scope.copyCheck) {
                $scope.storeData.items[1] = angular.copy($scope.storeData.items[0])
                $scope.storeData.items[1].type = "POSTAL";
                $scope.selCity1 = $scope.dd_city[_.findIndex($scope.dd_city, function (o) { return o.id == $scope.storeData.items[1].cityId; })];
            }
            else {
                var postalObj = {
                    "addressLine1": '',
                    "addressLine2": '',
                    "suburb": '',
                    "latitude": '',
                    "longitude": '',
                    "zipCode": '',
                    "type": "POSTAL",
                    "cityId": 0,
                    "cityName": "",
                    "stateName": "",
                    "countryName": ""
                }
                $scope.storeData.items[1] = postalObj;
                $scope.selCity1 = $scope.dd_city[0];
            }
        }


        $scope.sendStoreToApi = function () {
            debugger;
            $scope.storeData.businessAccountId = authService.authentication.businessAccountId;
            $scope.storeData.deviceFlavourId = 1;
            delete $scope.storeData.storeTypeName;
            delete $scope.storeData.timezoneDesc;
            delete $scope.storeData.currencyDesc;
            delete $scope.storeData.items[0].cityName;
            delete $scope.storeData.items[0].stateName;
            delete $scope.storeData.items[0].countryName;
            delete $scope.storeData.items[1].cityName;
            delete $scope.storeData.items[1].stateName;
            delete $scope.storeData.items[1].countryName;
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/setup/saveStoreSetup", $scope.storeData, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                var res = results;
                $scope.saveBusy = false;
                $location.path("/stores");
            });
        }


        $scope.saveSotreData = function () {
            debugger;
            if ($scope.imgData.length > 0) {
                $scope.busymsg = "Uploading Image.. Please Wait..";
                var config = {
                    apiKey: "AIzaSyBGnksShfcrUB3IRnizbdXI9--tZK2xGFc",
                    authDomain: "pika-qa-d6c91.firebaseapp.com",
                    databaseURL: "https://pika-qa-d6c91.firebaseio.com",
                    storageBucket: "pika-qa-d6c91.appspot.com",
                };

                var app = firebase.initializeApp(config),
                //database = app.database(),
                storage = app.storage();

                var file = document.getElementById('imgupload').files[0];
                // Get a reference to the location where we'll store our photos
                var storageRef = storage.ref().child('web_app/');

                // Get a reference to store file at photos/<FILENAME>.jpg
                var photoRef = storageRef.child(file.name);
                // Upload file to Firebase Storage
                var uploadTask = photoRef.put(file);
                uploadTask.on('state_changed', null, null, function () {
                    var downloadUrl = uploadTask.snapshot.downloadURL;
                    $scope.storeData.imageUrl = downloadUrl;
                    $scope.sendStoreToApi();
                });
            }
            else {
                $scope.sendStoreToApi();

            }
        }
        $scope.addStore = function (storeData) {

            if ($scope.store == 0) {
                $scope.businessAccountId = $scope.userDetails.businessAccountId;
                var lmn = _.find($scope.dd_storetype.storetypeList, { storeType: $scope.storeType });
                $scope.storeTypeId = lmn.id;
                var abc = _.find($scope.dd_currency.items, { currencyDesc: $scope.currencyDesc });
                $scope.currencyId = abc.id;
                var xyz = _.find($scope.dd_timezone.items, { timezoneDesc: $scope.timezoneDesc });
                $scope.timezoneId = xyz.id;
                var pqr = _.find($scope.dd_flavour, { flavourName: $scope.tabFlavour });
                $scope.appFlavourId = pqr.id;
                $scope.addr1.type = "PHYSICAL";
                $scope.addr2.type = "POSTAL";
                if ($scope.flag == 1) {
                    $scope.items.push($scope.addr1);
                    $scope.addr1.type = "POSTAL";
                    $scope.items.push($scope.addr1);
                }
                else {
                    $scope.items.push($scope.addr1);
                    $scope.items.push($scope.addr2);
                }
                $scope.storeData = {
                    businessAccountId: $scope.businessAccountId,
                    storeName: $scope.storeName,
                    storeTypeId: $scope.storeTypeId,
                    privateUrl: $scope.privateUrl,
                    currencyId: $scope.currencyId,
                    timezoneId: $scope.timezoneId,
                    deviceFlavourId: $scope.appFlavourId,
                    contactName: $scope.contactName,
                    contactNumber: $scope.contactNumber,
                    email: $scope.email,
                    twitter_Url: $scope.twitter_Url,
                    website: $scope.website,
                    items: $scope.items
                };
                debugger;
                var saveStoreUrl = "private/web/setup/saveStoreSetup";
                $scope.myAddStrPromise = basePostService.basePost($scope.storeData, saveStoreUrl);
                $scope.myAddStrPromise.then(function (results) {
                    $scope.addStrDetails = results;
                    debugger;
                });
                $window.location.reload();
            }

            else if ($scope.store == 1) {
                $scope.businessAccountId = $scope.userDetails.businessAccountId;
                var lmn = _.find($scope.dd_storetype.storetypeList, { storeType: $scope.storeType });
                $scope.storeTypeId = lmn.id;
                var abc = _.find($scope.dd_currency.items, { currencyDesc: $scope.currencyDesc });
                $scope.currencyId = abc.id;
                var xyz = _.find($scope.dd_timezone.items, { timezoneDesc: $scope.timezoneDesc });
                $scope.timezoneId = xyz.id;
                $scope.addr1.type = "PHYSICAL";
                $scope.addr2.type = "POSTAL";
                if ($scope.flag == 1) {
                    $scope.items.push($scope.addr1);
                    $scope.addr1.type = "POSTAL";
                    $scope.items.push($scope.addr1);
                }
                else {
                    $scope.items.push($scope.addr1);
                    $scope.items.push($scope.addr2);
                }
                $scope.storeData = {
                    businessAccountId: $scope.businessAccountId, storeId: $scope.storeId,
                    storeName: $scope.storeName,
                    storeTypeId: $scope.storeTypeId,
                    privateUrl: $scope.privateUrl,
                    currencyId: $scope.currencyId,
                    timezoneId: $scope.timezoneId,
                    contactName: $scope.contactName,
                    contactNumber: $scope.contactNumber,
                    email: $scope.email,
                    twitter_Url: $scope.twitter_Url,
                    website: $scope.website,
                    items: $scope.items
                };
                debugger;
                var saveStoreUrl = "private/web/setup/saveStoreSetup";
                $scope.myAddEditStrPromise = basePostService.basePost($scope.storeData, saveStoreUrl);
                $scope.myAddEditStrPromise.then(function (results) {
                    $scope.addEditStrDetails = results;
                    debugger;
                });
                $route.reload();
            }
        }

        $scope.convertImg = function (evt) {
            $scope.emsg = "";
            debugger;
            if (evt.files && evt.files[0]) {
                var img = document.createElement("img");
                var FR = new FileReader();
                FR.onload = function (e) {
                    debugger;
                    img.src = e.target.result
                    var width = img.width;
                    var height = img.height;
                    var imageData;
                    if (width > 400) {
                        imageData = _resize(img, 400, 300);
                    }
                    else {
                        imageData = e.target.result;
                    }
                    //var imageData = e.target.result;
                    $scope.imgData = imageData;
                    $scope.storeData.imageUrl = '';
                    $scope.$apply()
                    //}
                };
                FR.readAsDataURL(evt.files[0]);
            }
        }

        function _resize(img, maxWidth, maxHeight) {
            var ratio = 1;
            var canvas = document.createElement("canvas");
            canvas.style.display = "none";
            document.body.appendChild(canvas);

            var canvasCopy = document.createElement("canvas");
            canvasCopy.style.display = "none";
            document.body.appendChild(canvasCopy);

            var ctx = canvas.getContext("2d");
            var copyContext = canvasCopy.getContext("2d");

            if (img.width > maxWidth)
                ratio = maxWidth / img.width;
            else if (img.height > maxHeight)
                ratio = maxHeight / img.height;

            canvasCopy.width = img.width;
            canvasCopy.height = img.height;
            try {
                copyContext.drawImage(img, 0, 0);
            } catch (e) {
                document.getElementById('loader').style.display = "none";
                alert("There was a problem - please reupload your image");
                return false;
            }
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            // the line to change
            //ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
            // the method signature you are using is for slicing
            ctx.drawImage(canvasCopy, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL("image/png", 0.9);
            document.body.removeChild(canvas);
            document.body.removeChild(canvasCopy);

            return dataURL;


        };


        ///DEVICES///////////////////////////////////////////////////

        $scope.removeDevice = function (Id) {
            var strconfirm = confirm("Are you sure you want to remove this device?");
            if (strconfirm == true) {
                $scope.busymsg = "Removing Device.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/setup/removeDevice", {}, Id);
                $scope.myPromise.then(function (results) {
                    $scope.removeDeviceDetails = results;
                    $scope.saveBusy = false;
                    $scope.getDeviceData();
                });
            }
        }

        $scope.regeneratePin = function (deviceId) {
            var strconfirm = confirm("Are you sure you want to Regenerate Pin for this device?");
            if (strconfirm == true) {
                $scope.busymsg = "Regenerating Pin.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("GET", "web/setup/regenateDevicePin", {}, deviceId);
                $scope.myPromise.then(function (results) {
                    $scope.regenratePinDetails = results;
                    $scope.saveBusy = false;
                    $scope.getDeviceData();
                });
            }
        }

        $scope.addNewDevice = function () {
            var strconfirm = confirm("Are you sure you want to cretae a new device for your store?");
            if (strconfirm == true) {
                var tabData = {};
                tabData.storeId = $scope.STORE_ID;
                tabData.appFlavourId = 1;
                $scope.busymsg = "Creating Device.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("POST", "web/setup/setupStoreDevice", tabData, 0);
                $scope.myPromise.then(function (results) {
                    $scope.newDeviceDetails = results;
                    $scope.saveBusy = false;
                    $scope.getDeviceData();
                });
            }
        }
    }
    catch (e) { }
}]);