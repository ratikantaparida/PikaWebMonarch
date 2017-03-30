'use strict';
app.controller('offerController', ['$scope', '$rootScope', '$filter', 'genericService', 'localStorageService', '$location', 'authService', '$firebaseArray', '$firebaseObject', function ($scope, $rootScope, $filter, genericService, localStorageService, $location, authService, $firebaseArray, $firebaseObject) {
    try {
        debugger;
        $scope.emsg = "";
        $scope.orderByField = 'fdate';
        $scope.reverseSort = false;
        $scope.filterData = '';
        $scope.tableData = [];
        $scope.offerData = [];
        $scope.businessId = { "businessAccountId": authService.authentication.businessAccountId };

        $scope.getOfferData = function () {
            $scope.busymsg = "Getting Offers.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/test/getOfferStats", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.offerData = results.offerStats;
                $scope.saveBusy = false;
            });
        }
        $scope.getOfferData();



        $scope.dd_Categories = [];
        $scope.productSearch = [];
        $scope.dd_storeNames = [];
        $scope.dd_offertype = [];

        $scope.initNewOfferData = function () {
            $scope.EDIT = false;
            $scope.NewOfferData = {};
            $scope.NewOfferData.offerId = 0;
            $scope.NewOfferData.offerAt = '0';
            $scope.NewOfferData.productId = 0;
            $scope.NewOfferData.productCategoryId = 0;
            $scope.NewOfferData.offerCode = '';
            $scope.NewOfferData.offerDesc = '';
            $scope.NewOfferData.offerTypeId = 0;
            $scope.NewOfferData.offerLevel = 0;
            $scope.NewOfferData.storeList = [];
            $scope.NewOfferData.beginDate = new Date();
            $scope.NewOfferData.endDate = new Date();
            $scope.NewOfferData.imageUrl = '';

            $scope.imgData = '';
            $scope.offPro = '';
            $scope.offerCategory = $scope.dd_Categories[0];
            $scope.offerTypeDesc = $scope.dd_offertype[0];
            $scope.tags = [];
        }
        $scope.initNewOfferData();


        $scope.GetAllOfferType = function () {
            $scope.busymsg = "Getting Offer Type.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("GET", "web/setup/getAllOfferType", {}, 0);
            $scope.myPromise.then(function (results) {
                $scope.dd_offertype = results.offerTypeList;
                var pdata = { id: 0, description: "Please Select" };
                $scope.dd_offertype.splice(0, 0, pdata);
                $scope.offerTypeDesc = $scope.dd_offertype[0];
                $scope.saveBusy = false;
            });
        }

        $scope.GetAllStore = function () {
            debugger;
            $scope.busymsg = "Getting Stores.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/setup/getStoreNames", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.dd_storeNames = results.storesList;
                $scope.saveBusy = false;
                $scope.GetAllOfferType();
            });
        }

        $scope.GetAllProduct = function () {
            $scope.busymsg = "Getting Products.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("GET", "web/setup/getAllProducts", {}, 0);
            $scope.myPromise.then(function (results) {
                $scope.productSearch = results.productItems;
                $scope.saveBusy = false;
                $scope.GetAllStore();
            });
        }

        $scope.GetCategory = function () {
            $scope.busymsg = "Getting Categories.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("GET", "web/setup/getAllProductCategory", {}, 0);
            $scope.myPromise.then(function (results) {
                $scope.dd_Categories = results.productcategoryList;
                var pdata = { id: 0, categoryName: "Please Select" };
                $scope.dd_Categories.splice(0, 0, pdata);
                $scope.offerCategory = $scope.dd_Categories[0];
                $scope.saveBusy = false;
                $scope.GetAllProduct();
            });
        }
        $scope.GetCategory();

        $scope.adEditOffer = function (odata, edit) {
            $scope.initNewOfferData();
            $scope.EDIT = edit;
            if (edit == true) {
                $scope.busymsg = "Getting Offer Details.. Please Wait.."
                $scope.saveBusy = true;
                $scope.myPromise = genericService.genericFunction("POST", "web/setup/getOfferDetails", { "offerId": odata.offerId }, 0);
                $scope.myPromise.then(function (results) {
                    debugger;
                    $scope.NewOfferData = results.offerDetails;
                    $scope.NewOfferData.beginDate = new Date(results.offerDetails.beginDate);
                    $scope.NewOfferData.endDate = new Date(results.offerDetails.endDate);
                    $scope.tags = results.offerDetails.storeList;
                    //$scope.offerTypeDesc = results.offerDetails.offerTypeDesc;
                    //$scope.offerCategory = results.offerDetails.productCategory;
                    if ($scope.offerAt == 'Product')
                        $scope.offPro = $scope.productSearch[_.findIndex($scope.productSearch, function (o) { return o.id == $scope.NewOfferData.productId; })].productDesc;
                    $scope.offerTypeDesc = $scope.dd_offertype[_.findIndex($scope.dd_offertype, function (o) { return o.id == $scope.NewOfferData.offerTypeId; })];
                    $scope.offerCategory = $scope.dd_Categories[_.findIndex($scope.dd_Categories, function (o) { return o.id == $scope.NewOfferData.productCategoryId; })];
                    //$scope.mdata.district = $scope.AllDistricts[_.findIndex($scope.AllDistricts, $scope.mdata.district)];
                    $scope.saveBusy = false;
                    $("#offerAddModal").modal('show');
                });
            }
            else
                $("#offerAddModal").modal('show');
        }

        $scope.loadTags = function (query) {
            var tags = $scope.dd_storeNames;
            return tags;
        };



        // render an entry INACTIVE on delete   
        $scope.removeOffer = function (offerId) {
            $scope.busymsg = "Removing Offer.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("GET", "web/setup/removeOffer", {}, offerId);
            $scope.myPromise.then(function (results) {
                $scope.removeOfferDetails = results;
                $scope.saveBusy = false;
                $scope.getOfferData();
            });
        }

        $scope.sendOfferToApi = function () {
            debugger;
            if ($scope.EDIT == true)
                $scope.busymsg = "Updating Offer.. Please Wait..";
            else {
                $scope.busymsg = "Saving Offer.. Please Wait.."
                delete $scope.NewOfferData.offerId;
            }

            $scope.NewOfferData.businessAccountId = authService.authentication.businessAccountId;
            if ($scope.NewOfferData.offerAt == 'Product') {
                $scope.NewOfferData.productId = $scope.productSearch[_.findIndex($scope.productSearch, function (o) { return o.productDesc == $scope.offPro; })].id;
                $scope.NewOfferData.productCategoryId = null;
            }
            else if ($scope.NewOfferData.offerAt == 'Category') {
                $scope.NewOfferData.productCategoryId = $scope.offerCategory.id;
                $scope.NewOfferData.productId = null;
            }
            $scope.NewOfferData.offerTypeId = $scope.offerTypeDesc.id
            if ($scope.NewOfferData.offerLevel == 'business')
                $scope.NewOfferData.storeList = null;
            else
                $scope.NewOfferData.storeList = $scope.tags;;

            $scope.NewOfferData.beginDate = $filter('date')(new Date($scope.NewOfferData.beginDate), 'MM/dd/yyyy');
            $scope.NewOfferData.endDate = $filter('date')(new Date($scope.NewOfferData.endDate), 'MM/dd/yyyy');

            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/setup/saveOfferSetup", $scope.NewOfferData, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                var res = results;
                $scope.saveBusy = false;
                $("#offerAddModal").modal('hide');
                $scope.getOfferData();
            });
        }


        $scope.saveOffer = function () {
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
                    $scope.NewOfferData.imageUrl = downloadUrl;
                    $scope.sendOfferToApi();
                });
            }
            else {
                $scope.sendOfferToApi();

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

                    $scope.NewOfferData.imageUrl = '';
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
    }
    catch (e) { }
}]);