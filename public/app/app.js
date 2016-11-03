"use strict";
// public/js/app.js
angular.module('defaultApp', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngAria'])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('nav.landing', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
      })
      .state('nav', {
        url: '/nav',
        templateUrl: 'views/nav.html',
        controller: 'homeCtrl'
      })
      .state('nav.register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'homeCtrl'
      })
      .state('nav.login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'homeCtrl'
      })
      .state('nav.second', {
        url: '/second',
        templateUrl: 'views/secondpage.html'
      });

    $urlRouterProvider.otherwise('/home');
  });
