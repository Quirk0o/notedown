'use strict';

import {Router} from 'express'
import * as drive from './drive.service'
import * as auth from '../auth/auth.service'

let router = new Router();

router.post('/', auth.isAuthenticated(), drive.upload);

export default router;
