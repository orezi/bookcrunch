"use strict";
angular.module("defaultApp")
  .controller("homeCtrl", ["$scope", "$state", "$mdDialog", "$rootScope", "$mdToast", "$stateParams", "UserService", "BookService", "$location", function($scope, $state, $mdDialog, $rootScope, $mdToast, $stateParams, UserService, BookService, $location) {
    $scope.loadSlideshow = function() {
      $("#slides").slidesjs({
        width: 1024,
        height: 250,
        play: {
          active: false,
          effect: "slide",
          interval: 3000,
          auto: true,
          swap: true,
          pauseOnHover: true,
          restartDelay: 2500
        },
        pagination: {
          active: false,
          effect: "slide"
        },
        navigation: {
          active: false,
          effect: "slide"
        }
      });
    }
    $scope.pay = function() {
      UserService.pay().then(function(res) {
        $scope.update = res;
      });
    };

    $scope.verifyUser = function() {
      UserService.verifyUser($stateParams.user_id).success(function(res) {
        $scope.verified = res;
      });
    }

    $scope.hoverIn = function() {
      this.hoverEdit = true;
    };

    $scope.hoverOut = function() {
      this.hoverEdit = false;
    };

    $scope.passwordReset = function(password) {
      if ($scope.password1 === $scope.password2) {
        UserService.passwordReset($stateParams.token, { 'password': password }).success(function(res) {
          $scope.passReset = true;
          $mdToast.show(
            $mdToast.simple()
            .content("Password changed! Redirecting to login...")
            .hideDelay(4000)
          ).then(function(res) {
            $location.url("/nav/login");
          })
        });
      } else if ($scope.password2 && $scope.password1) {
        $mdToast.show(
          $mdToast.simple()
          .content("Password Mismatch!")
          .hideDelay(4000)
        );
      }
    };


    //confirm before deleting account
    $scope.showConfirmDelete = function(ev) {
      var confirm = $mdDialog.confirm()
        .title("You are about to delete your account")
        .content("This will remove all your details and revoke ability to read books here. Are you sure you want to delete your account?")
        .ariaLabel("Lucky day")
        .targetEvent(ev)
        .ok("Yes")
        .cancel("Cancel");
      $mdDialog.show(confirm).then(function() {
        $scope.deleteAccount();
      });
    };

    $scope.deleteAccount = function() {
      UserService.deleteUser().then(function(res) {
        localStorage.removeItem("userToken")
        window.location.reload();
      });
    };

    $scope.getCurrentUser = function() {
      UserService.getCurrentUser().then(function(res) {
        $scope.userDetails = res.data;
      });
    };

    $scope.loginUser = function(userData) {
      UserService.login(userData).then(function(res) {
        $scope.progressLoad = true;
        $scope.isLoggedIn = false;
        if (res.data.message === "Authentication failed. User not found.") {
          $mdToast.show(
            $mdToast.simple()
            .content("Username or password mismatch")
            .hideDelay(3000)
          );
          $scope.progressLoad = false;
          $scope.isLoggedIn = false;
        } else if (res.data.message === "User not verified.") {
          $mdToast.show(
            $mdToast.simple()
            .content("Email yet to be verified. Please click link sent to email upon registration.")
            .hideDelay(5000)
          );
          $scope.progressLoad = false;
          $scope.isLoggedIn = false;
        } else if (res.data.message === "Authentication failed.") {
          $mdToast.show(
            $mdToast.simple()
            .content("Username or password mismatch")
            .hideDelay(3000)
          );
          $scope.progressLoad = false;
          $scope.isLoggedIn = false;
        } else {
          //set token in localstorage
          localStorage.setItem("userToken", res.data.token);
          if (localStorage.getItem("userToken")) {
            $scope.userDetails = userData;
            $scope.response = res;
            $scope.progressLoad = false;
            $scope.isLoggedIn = true;
            $scope.userInformation = res.data.user;
            $mdToast.show(
              $mdToast.simple()
              .content("Login successful!")
              .hideDelay(3000)
            );
            $location.url("/nav/home");
            window.location.reload()
          }
        }
      });
    };

    //create a new user
    $scope.signUp = function(newUser) {
      $scope.progressLoad = true;
      $scope.isNewUser = false;
      UserService.createUser(newUser).then(function(res) {
        if (res.data.message === "user email taken") {
          $mdToast.show(
            $mdToast.simple()
            .content("Email already exists")
            .hideDelay(3000)
          );
        } else if (res.data.message === "Check parameters!") {
          $mdToast.show(
            $mdToast.simple()
            .content("Check for errors")
            .hideDelay(3000)
          );
        } else {
          $scope.userDetails = res;
          $scope.progressLoad = false;
          $scope.isNewUser = true;
          $mdToast.show(
            $mdToast.simple()
            .content("Check email for verification link before you continue!")
            .hideDelay(9000)
          );
          $location.url("/nav/login");
        }
      });
    };

    $scope.getAllBooks = function() {
      BookService.getAllBooks().then(function(res) {
        $scope.books = res.data;
      });
    };

    $scope.logout = function() {
      $scope.isLoggedIn = true;
      localStorage.removeItem("userToken");
      if (localStorage.getItem("userToken")) {
        $scope.isLoggedIn = true;
      } else {
        $scope.isLoggedIn = false;
        window.location.reload().then(function() {
          $mdToast.show(
            $mdToast.simple()
            .content("You've been logged out!")
            .hideDelay(3000)
          );
        });
      }
    };

    $rootScope.signupCheck = function() {
      if (localStorage.getItem('userToken')) {
        UserService.decodeUser();
        $rootScope.signedIn = true;
      }
      $rootScope.signedIn = false;
    };

    $scope.showPrompt = function(ev) {
      var confirm = $mdDialog.prompt()
        .title('Forgot password')
        .textContent('Insert your email for password reset link to be sent to.')
        .placeholder('Email')
        .ariaLabel('Dog name')
        .targetEvent(ev)
        .ok('Send link!')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        $scope.status = 'Check ' + result + 'for password reset link';
        $scope.sendForgotPassEmail(result);
      }, function() {
        $scope.status = 'Cancelled!';
      });
    };

    $scope.sendForgotPassEmail = function(result) {
      UserService.forgotPassword(result).then(function(res) {
        $scope.result = res;
        $mdToast.show(
          $mdToast.simple()
          .content("Check your email for reset link!")
          .hideDelay(8000)
        );
      });
    };

  }]);
