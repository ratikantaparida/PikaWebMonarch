'use strict';
app.controller('messageController', ['$scope', '$filter', '$location', 'localStorageService', 'genericService', 'authService', '$firebaseArray', '$timeout', function ($scope, $filter, $location, localStorageService, genericService, authService, $firebaseArray, $timeout) {
    debugger;

    try {

        $scope.webMsg = {};
        $scope.webMsg.name = '';
        $scope.webMsg.time = '';
        $scope.webMsg.toStore = '';
        $scope.webMsg.text = '';
        $scope.wmsg = '';
        $scope.users = [];
        $scope.messages = [];
        $scope.chatMsg = '';
        /////////////STORE//////
        $scope.selStore = {};
        $scope.dd_storeNames = [];
        $scope.consumerNames = [];
        $scope.businessId = { "businessAccountId": authService.authentication.businessAccountId };
        $scope.businessAccountId = $scope.businessId.businessAccountId;

        $scope.setemoji = function () {
            // Initializes and creates emoji set from sprite sheet
            debugger;
            window.emojiPicker = new EmojiPicker({
                emojiable_selector: '[data-emojiable=true]',
                assetsPath: 'emoji/img/',
                popupButtonClasses: 'fa fa-smile-o'
            });
            // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
            // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
            // It can be called as many times as necessary; previously converted input fields will not be converted again
            window.emojiPicker.discover();
        };
        $scope.setemoji();


        $scope.GetConsumers = function () {
            debugger;
            $scope.busymsg = "Getting Consumers.. Please Wait.."
            $scope.saveBusy = true;
            $scope.myPromise = genericService.genericFunction("POST", "web/test/consumerList", $scope.businessId, 0);
            $scope.myPromise.then(function (results) {
                debugger;
                $scope.consumerNames = results.consumerDetailList;
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
                var pdata = { storeId: 0, storeName: "SELECT STORE" };
                $scope.dd_storeNames.splice(0, 0, pdata);
                $scope.selStore = $scope.dd_storeNames[0];
                $scope.saveBusy = false;
                $scope.GetConsumers();
            });
        }
        $scope.GetAllStore();

        $scope.consumerName = function (id, u) {
            $scope.lastMsgs = u;
            var abc = _.find($scope.consumerNames, { consumerId: id });
            if (abc != undefined)
                return abc.consumerFirstName;
            else
                return "Not Found";
        }


        //////////////////////////////FIREBASE WORK////////////////////
        var config = {
            apiKey: "AIzaSyBGnksShfcrUB3IRnizbdXI9--tZK2xGFc",
            authDomain: "pika-qa-d6c91.firebaseapp.com",
            databaseURL: "https://pika-qa-d6c91.firebaseio.com",
            storageBucket: "pika-qa-d6c91.appspot.com",
        };
        firebase.initializeApp(config);
        var messages;

        $scope.selUid = -1;
        $scope.getUsers = function () {
            debugger;
            $scope.selUid = -1;
            if ($scope.selStore.storeId != 0) {
                $scope.storeId = $scope.selStore.storeId;
                var ref = firebase.database().ref().child('messages/' + $scope.selStore.storeId);
                messages = $firebaseArray(ref);
                //$scope.searchNewMsg(messages);
                $scope.users = messages;
                var a = 0;
            }
            else {

            }

        }

        $scope.getMsgs = function (msg) {
            debugger;
            $scope.selUid = msg.$id;
            $scope.chatMsg = "";
            var ref = firebase.database().ref().child('messages/' + $scope.selStore.storeId + '/' + $scope.selUid);
            messages = $firebaseArray(ref);
            $scope.messages = msg;
            var abc = _.find($scope.consumerNames, { consumerId: msg.$id });
            if (abc != undefined)
                $scope.consumerChatName = abc.consumerFirstName;
            else
                $scope.consumerChatName = 'Not Found';
            $timeout(function () {
                var scroller = document.getElementById("scrollBox");
                scroller.scrollTop = scroller.scrollHeight;
            }, 0, false);
        }

        $scope.sendMessage = function () {
            debugger;
            $scope.webMsg.time = new Date().getTime();
            $scope.webMsg.name = '';
            $scope.webMsg.toStore = false;
            $scope.webMsg.text = $scope.chatMsg;
            messages.$add($scope.webMsg);
            $scope.webMsg = {};
            $scope.webMsg.name = '';
            $scope.webMsg.time = '';
            $scope.webMsg.toStore = '';
            $scope.webMsg.text = '';

            $scope.chatMsg = "";

            $timeout(function () {
                var scroller = document.getElementById("scrollBox");
                scroller.scrollTop = scroller.scrollHeight;
            }, 0, false);
        }

        ref.on('value', function (messagesSnap) {
            $timeout(function () {
                var scroller = document.getElementById("scrollBox");
                scroller.scrollTop = scroller.scrollHeight;
            }, 0, false);
        });


        

    }
    catch (e) { }
}]);