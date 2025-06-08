// Import the Express framework
const express = require('express');

// Import passport.js 
const passport = require('passport');

// Create a router object to handle routes
const router = express.Router();

// Import the authentication controller which contains the actual logic for the routes
const authController = require('../controllers/auth.controller');

// Define a POST route for user registration
router.post('/register', authController.register);

// Define a POST route for use login
router.post('/login', authController.login);

// Define a POST route for setting up two-factor authentication (2FA)
router.post('/2fa/setup', authController.setup2FA);

// Define a POST route for verifying two-factor authentication (2FA) codes
router.post('/2fa/verify', authController.verify2FA);

// Define a POST route for refreshing tokens
router.post('/refresh-token', authController.refreshToken);

// Define a POST route for requesting a password reset
router.post('/forgot-password', authController.forgotPassword)

// Google login
router.get('/google', passport.authenticate('google', {scope: ['email', 'profile'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Optionally check user.is2FAEnabled
        res.redirect('/dashboard')
    }
)

// GitHub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/dashboard')
    }
);

// Export the router to make it available for use in other parts of the application
module.exports = router;
