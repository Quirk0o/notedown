'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import uiRouter from 'angular-ui-router';

import constants from 'app/app.constant';
import util from 'components/util/util.module';

import AuthService from './auth.service';
import authInterceptor from './interceptor.service';
import UserResource from './user.service';
import routerDecorator from './router.decorator';

export default angular.module('notedownApp.auth', [
  constants,
  util,
  ngCookies,
  uiRouter
])
  .config(function($httpProvider) {
    'ngInject';
    $httpProvider.interceptors.push('authInterceptor');
  })
  .factory('Auth', AuthService)
  .factory('authInterceptor', authInterceptor)
  .factory('User', UserResource)
  .run(routerDecorator)
  .name;
