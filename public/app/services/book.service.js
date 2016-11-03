"use strict";
angular.module("defaultApp")
  .factory("BookService", ["$http", "$rootScope", function($http, $rootScope) {

    function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += '==';
          break;
        case 3:
          output += '=';
          break;
        default:
          throw 'Illegal base64url string!';
      }
      return window.atob(output);
    }

    return {

      getAllBooks: function() {
        return $http.get("/api/books");
      },
      getBook: function(id) {
        var token = localStorage.getItem('userToken');
        return $http.get("/api/user/" + id + "?token=" + token);
      },

      login: function(param) {
        return $http.post("/api/authenticate", param);
      },

      createBook: function(newUser) {
        return $http.post("/api/users", newUser);
      },

      deleteBook: function(id) {
        var token = localStorage.getItem("userToken");
        return $http.delete("/api/user/" + id + "?token=" + token);
      },

      updateBook: function(bookObj, id) {
        var token = localStorage.getItem("userToken");
        return $http.put("/api/user/" + id + "?token=" + token, bookObj);
      }
    };

  }]);
