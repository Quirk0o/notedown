'use strict';

angular.module('notedownApp.auth', [
  'notedownApp.constants',
  'notedownApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
