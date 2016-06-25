'use strict';

import angular from 'angular';

import NavbarController from './navbar.controller';

const Navbar = {
  template:   require('./navbar.html'),
  controller: NavbarController,
  bindings:   {
    onSearch:  '&',
    onShowAll: '&'
  }
};

export default angular.module('notedownApp.components.navbar', [])
    .component('navbar', Navbar)
    .name;
