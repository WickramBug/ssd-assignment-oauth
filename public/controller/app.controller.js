"use strict";

angular.module("app.controller", []).controller("AppController", [
    "$scope",
    "$location",
    "AppService",
    function($scope, $location, AppService) {
        //$scope.successMessage = "";
        //$scope.successMessagebool = false;
        $scope.mail = {
            to: "",
            subject: "",
            body: ""
        };

        $scope.initialize = function() {
            var url = $location.url();

            if (url === "/login") {
                $scope.retrieveOAuthUrl();
            }
        };

        // get authorization url from server
        $scope.retrieveOAuthUrl = function() {
            AppService.retrieveOAuthUrl().then(
                (data) => {
                    $scope.authUrl = data.url;
                },
                (err) => {
                    console.error(err);
                }
            );
        };

        $scope.sendMail = function() {
            AppService.sendMail($scope.mail).then(
                () => {
                    //$scope.successMessage = "Message sent successfully";
                    //$scope.successMessagebool = true;
                    console.log("Success");
                },
                (err) => {
                    //$scope.successMessagebool = false;
                    console.error(err);
                }
            );
        };

        $scope.initialize();
    }
]);
