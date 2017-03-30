var app = angular.module('PIKA_WEB_APP', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'cgBusy', 'ui.bootstrap', 'angular-loading-bar', 'ngTagsInput', 'firebase']);
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});
app.config(function ($routeProvider) {
    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/PikaWeb/app/views/login.html"
    });
    $routeProvider.when("/overview", {
        controller: "homeController",
        templateUrl: "/PikaWeb/app/views/home.html"
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
    $routeProvider.when("/storewizard/storeId/:store_ID", {
        controller: "storewizardController",
        templateUrl: "/PikaWeb/app/views/storewizard.html"
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
    $routeProvider.otherwise({ redirectTo: "/overview" });
});
app.run(['authService', '$rootScope', '$location', 'localStorageService', function (authService, $rootScope, $location, localStorageService) {
    authService.fillAuthData();
    $rootScope.$on('$routeChangeStart', function (event) {
        if (!authService.authentication.isAuth) {
            //event.preventDefault();
            $location.path('/login');
        }
        else {
            var authData = localStorageService.get('authorizationData');
            var exp = authData.expiry;
            var ndate = new Date().getTime();
            if (ndate > exp) {
                authService.logOut();
                // event.preventDefault();
                $location.path('/login');
            }
        }
    });
}]);

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

