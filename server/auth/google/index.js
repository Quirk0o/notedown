'use strict';

import express from 'express';
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

const router = express.Router();

router
    .get('/', passport.authenticate('google', {
      failureRedirect: '/signup',
      scope:           [
        'profile',
        'email',
        'https://www.googleapis.com/auth/drive.file'
      ],
      session:         false
    }))
    .get('/callback', passport.authenticate('google', {
      failureRedirect: '/signup',
      session:         false
    }), setTokenCookie);

export default router;
