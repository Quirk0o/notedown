'use strict';

import router from './main.routes';
import MainController from './main.controller';

import './main.scss';

export default angular.module('notedownApp.main', [])
  .config(router)
  .controller('MainController', MainController)
  .name;
