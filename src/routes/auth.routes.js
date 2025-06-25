

const FRONTEND_URL = process.env.FRONTEND_URL || "localhost:3000";


// Import the Express framework
const express = require('express');

// Import passport.js for authentication
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

// ===== Google OAuth2 Login Routes ==== //

// Route to initiate Google OAuth2 login
// When a user visits '/google', Passport redirects them to Google's OAuth2 consent screen
router.get('/google', passport.authenticate('google', 
    {scope: ['email', 'profile'] // Request access to the user's email and profile info
}));

// Callback route after Google OAuth2 authentication
router.get(
    '/google/callback',
    // Passport middleware handles authentication:
    // - On success, attaches user data to `req.user`
    // - On failure, redirects to '/login'
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h'})
        // Check if the user has 2FA enabled (assuming `req.user` exists after auth)
        if (req.user.is2FAEnabled) {
            // Redirect to 2FA verification page instead of dashboard
            return res.redirect(`${FRONTEND_URL}/verify-2fa?token=${token}`);
        }

        // After successful auth, redirect to dashboard if 2FA is disabled
        res.redirect(`${FRONTEND_URL}/dashboard`)
    }
)

// ====== GitHub OAuth Login Routes ====== //

// Route to initiate GitHub OAuth login
router.get('/github', passport.authenticate('github', 
    { scope: ['user:email'] // Request access to the user's email
}));

// Callback route after GitHub authentication
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        if (req.user.is2FAEnabled) {
            return res.redirect('/verify-2fa');
        }
        res.redirect('/dashboard');
    }
);

// Export the router to make it available for use in other parts of the application
module.exports = router;
