'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', '$rootScope', function ($http, $q, localStorageService, $rootScope) {
    var authServiceFactory = {};
    //var _APIconnector = 'http://104.199.194.235:8090/private/';
    var _APIconnector = 'http://192.168.0.5:8090/private/';
    var _authentication = {
        isAuth: false,
        email: "",
        uid: 0,
        roles: [],
        ldate: "",
        expiry: "",
        menu: [],
        businessAccountId: "",
        businessRoleId: "",
        businessAccountImage: "",
        businessName: "",
        firstName: "",
        lastName: "",
    };


    var _login = function (loginData) {
        var data = "grant_type=password&email=" + loginData.email + "&password=" + loginData.password;
        var deferred = $q.defer();
        $http.post(_APIconnector + "web/business/login", data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json; charset=utf-8' } }).success(function (response, status, headers, config) {
            if (response.genericResponse.apiSuccessStatus == true) {
                var lData = {
                    token: response.systemAuthtoken,
                    businessAccountId: response.businessAccountId,
                    businessRoleId: response.businessRoleId,
                    businessAccountImage: response.businessAccountImage,
                    businessName: response.businessName,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    menu: response.menuItemList,
                    email: loginData.email,
                    expiry: (response.expires_in * 1000) + new Date().getTime(),
                    ldate: new Date().getTime(),
                };
                localStorageService.set('authorizationData', lData);
                _fillAuthData();
                deferred.resolve(response);
            }
            else {
                _logOut();
                deferred.reject(response);
            }


        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });
        return deferred.promise;
    };
    var _logOut = function () {
        //$window.localStorage.clear();
        localStorage.removeItem('lastPill');
        localStorage.removeItem('lastRuleTab');
        localStorage.removeItem('lastTabIndex');
        localStorage.removeItem('myStep');
        localStorageService.remove('authorizationData');
        _authentication.isAuth = false;
        _authentication.email = "";
        _authentication.uid = 0;
        _authentication.roles = [];
        _authentication.ldate = "";
        _authentication.expiry = "";
        _authentication.menu = [];
        _authentication.businessAccountId = "";
        _authentication.businessRoleId = "";
        _authentication.businessAccountImage = "";
        _authentication.businessName = "";
        _authentication.firstName = "";
        _authentication.lastName = "";
    };

    var _fillAuthData = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.email = authData.email;
            _authentication.uid = authData.uid;
            _authentication.roles = authData.roles;
            _authentication.ldate = authData.ldate;
            _authentication.expiry = authData.expiry;
            _authentication.menu = authData.menu;
            _authentication.businessAccountId = authData.businessAccountId;
            _authentication.businessRoleId = authData.businessRoleId;
            _authentication.businessAccountImage = authData.businessAccountImage;
            _authentication.businessName = authData.businessName;
            _authentication.firstName = authData.firstName;
            _authentication.lastName = authData.lastName;
        }
    }


    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.APIconnector = _APIconnector;

    return authServiceFactory;
}]);