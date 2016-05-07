'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import auth from 'components/auth/auth.module';

import router from './admin.router';
import controller from './admin.controller';

import './admin.scss';

export default angular.module('notedownApp.admin', [
    auth,
    uiRouter
  ])
  .config(router)
  .controller('AdminController', controller)
  .name;
