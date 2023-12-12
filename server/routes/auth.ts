const router = require('express').Router();
import passport from 'passport';

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));