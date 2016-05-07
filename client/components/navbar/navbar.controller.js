'use strict';

export default class NavbarController {

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    
    this.isCollapsed = true;
    this.menu = [{
      'title': 'Home',
      'state': 'main'
    }];
  }
}
