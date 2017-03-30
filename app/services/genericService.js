'use strict';
app.factory('genericService', ['$http', '$q', 'authService', function ($http, $q, authService) {
    var serviceBase = authService.APIconnector;
    var genericServiceFactory = {};

    var _genericFunction = function (method, ctrl, data, qid) {
        var deferred = $q.defer();
        if (method == 'GET') {
            var rurl = serviceBase + ctrl;
            if (qid != 0)
                rurl = rurl + "/" + qid
            $http.get(rurl).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
        }
        else if (method == "POST") {
            var postdata = { method: "POST", url: serviceBase + ctrl, data: data };
            $http(postdata).success(function (res) {
                deferred.resolve(res);
            }).error(function (err) {
                deferred.reject(err);
            });
        }
        else if (method == "PUT") {
            var postdata = { method: "PUT", url: serviceBase + ctrl + '/' + qid, data: data };
            $http(postdata).success(function (res) {
                deferred.resolve(res);
            }).error(function (err) {
                deferred.reject(err);
            });
        }
        else if (method == "DELETE") {
            var deferred = $q.defer();
            $http.delete(serviceBase + ctrl + '/' + qid).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
        }
        return deferred.promise;
    };
    genericServiceFactory.genericFunction = _genericFunction;
    return genericServiceFactory;

}]);