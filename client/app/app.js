'use strict';

import './app.scss';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import validationMatch from 'angular-validation-match';

import auth from 'components/auth/auth.module';
import constants from './app.constant';
import components from 'components/components.module';
import directives from 'components/directives.module';
import services from 'components/services.module';
import note from 'components/notes/note.module';

import admin from './admin/admin.module';
import account from './account/account';
import main from './main/main';

import socketIO from 'exports?"btford.socket-io"!angular-socket-io';

angular.module('notedownApp', [
  auth,
  note,
  admin,
  account,
  main,
  constants,
  components,
  directives,
  services,
  ngCookies,
  ngResource,
  ngSanitize,
  socketIO,
  uiRouter,
  uiBootstrap,
  validationMatch
])
  .config(function($urlRouterProvider, $locationProvider) {
    'ngInject';
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
