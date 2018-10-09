"use strict";

angular.module("app.service", []).factory("AppService", [
    "$http",
    "$q",
    function($http, $q) {
        return {

            // retrieve oauth url from server
            retrieveOAuthUrl: function() {
                var defer = $q.defer();

                $http.get("/api/gmail/oauth").then(
                    (results) => {
                        defer.resolve(results.data);
                    },
                    (err) => {
                        defer.reject(err);
                    }
                );

                return defer.promise;
            },

            sendMail: function(mail){
                var defer = $q.defer();

                $http({
                    url: "/api/gmail/send",
                    method: "POST",
                    data: mail
                }, (results) => {
                    defer.resolve(results.data);
                }, err => {
                    defer.reject(err);
                });

                return defer.promise;
            }
        };
    }
]);