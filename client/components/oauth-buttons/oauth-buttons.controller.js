'use strict';

export default class OauthButtonsController {
  constructor($window) {
    this.$window = $window;
  }

  loginOauth(provider) {
    this.$window.location.href = '/auth/' + provider;
  }
}
