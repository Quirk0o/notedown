'use strict';

export default class OauthButtonsController {
  constructor($window) {
    'ngInject';
    this.$window = $window;
  }

  loginOauth(provider) {
    this.$window.location.href = '/auth/' + provider;
  }
}
