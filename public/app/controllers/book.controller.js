"use strict";
angular.module("defaultApp")
  .controller("bookCtrl", ["$scope", "$state", "$mdToast", "$stateParams", "BookService", "$location", function($scope, $state, $mdToast, $stateParams, BookService, $location) {
    
    $scope.getAllBooks = function() {
      BookService.getAllBooks().then(function(res) {
        $scope.books = res;
        console.log("books", res);
      });
    };
  }]);
