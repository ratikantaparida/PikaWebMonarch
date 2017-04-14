var app = angular.module('PIKA_WEB_APP', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'cgBusy', 'ui.bootstrap', 'angular-loading-bar', 'ngTagsInput', 'firebase']);
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});
app.config(function ($routeProvider) {
    $routeProvider.when("/overview", {
        controller: "overviewController",
        templateUrl: "/PikaWeb/app/views/overview.html"
    });
    $routeProvider.when("/campaign", {
        controller: "campaignController",
        templateUrl: "/PikaWeb/app/views/campaign.html"
    });
    $routeProvider.when("/wizard", {
        controller: "wizardController",
        templateUrl: "/PikaWeb/app/views/wizard.html"
    });
    $routeProvider.when("/stores", {
        controller: "storeController",
        templateUrl: "/PikaWeb/app/views/store.html"
    });
    $routeProvider.when("/consumer", {
        controller: "consumerController",
        templateUrl: "/PikaWeb/app/views/consumer.html"
    });
    $routeProvider.when("/storewizard/storeId/:store_ID", {
        controller: "storeWizardController",
        templateUrl: "/PikaWeb/app/views/storeWizard.html"
    });
    $routeProvider.when("/offers", {
        controller: "offerController",
        templateUrl: "/PikaWeb/app/views/offer.html"
    });
    $routeProvider.when("/notif", {
        controller: "notifyController",
        templateUrl: "/PikaWeb/app/views/notify.html"
    });
    $routeProvider.when("/message", {
        controller: "messageController",
        templateUrl: "/PikaWeb/app/views/message.html"
    });
    $routeProvider.when("/bdetails", {
        controller: "businessSetupController",
        templateUrl: "/PikaWeb/app/views/businessSetup.html"
    });
    $routeProvider.when("/giftsetting", {
        controller: "giftSettingController",
        templateUrl: "/PikaWeb/app/views/giftSetting.html"
    });
    $routeProvider.when("/pointsetting", {
        controller: "pointSettingController",
        templateUrl: "/PikaWeb/app/views/pointSetting.html"
    });
    $routeProvider.when("/badgesetting", {
        controller: "badgeSettingController",
        templateUrl: "/PikaWeb/app/views/badgeSetting.html"
    });
    $routeProvider.when("/careport", {
        controller: "reportConsumerController",
        templateUrl: "/PikaWeb/app/views/reportConsumer.html"
    });
    $routeProvider.otherwise({ redirectTo: "/careport" });
});
app.run(['authService', '$rootScope', '$location', 'localStorageService', '$window', function (authService, $rootScope, $location, localStorageService, $window) {
    authService.fillAuthData();
    $rootScope.$on('$routeChangeStart', function (event) {
        if (!authService.authentication.isAuth) {
            //event.preventDefault();
            $window.location.href = 'login.html';
        }
        else {
            var authData = localStorageService.get('authorizationData');
            var exp = authData.expiry;
            var ndate = new Date().getTime();
            if (ndate > exp) {
                authService.logOut();
                // event.preventDefault();
                $window.location.href = 'login.html';
            }
        }
    });
}]);

app.filter('start', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }

        start = +start;
        return input.slice(start);
    };
});
// typeahead code

var secretEmptyKey = '[$empty$]'

app.directive('emptyTypeahead', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            // this parser run before typeahead's parser
            modelCtrl.$parsers.unshift(function (inputValue) {
                debugger;
                var value = (inputValue ? inputValue : secretEmptyKey); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
                modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
                return value;
            });
            // this parser run after typeahead's parser
            modelCtrl.$parsers.push(function (inputValue) {
                debugger;
                return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
            });
        }
    }
})


