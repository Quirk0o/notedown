'use strict';

import router from './account.routes';

import LoginController from './login/login.controller';
import SettingsController from './settings/settings.controller';
import SignupController from './signup/signup.controller';

export default angular.module('notedownApp.account', [])
  .config(router)
  .controller('LoginController', LoginController)
  .controller('SettingsController', SettingsController)
  .controller('SignupController', SignupController)
  .run(function ($rootScope) {
    'ngInject';
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  })
  .name;
