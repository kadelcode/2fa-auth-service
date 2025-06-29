require('dotenv').config();
const axios = require('axios');

// Import required modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');

// Configure Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy(
        {
            // Configuration options for Google strategy
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback', // Callback URL after Google authentication
        },
        // Verification function that runs after successful Google authentication
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in database using Google ID
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // If not found, try by email (in case user signed up locally)
                    user = await User.findOne({ email: profile.emails[0].value });
                    // If user doesn't exist, create a new user in database
                    /*user = await User.create({
                        email: profile.emails[0].value, // Get email from Google profile
                        googleId: profile.id, // Google's unique ID for the user
                        name: profile.displayName, // User's display name from Google
                    });*/

                    if (user) {
                        // Link the existing account to Google
                        user.googleId = profile.id;
                        await user.save();
                    } else {
                        // No user found - create new one
                        user = await User.create({
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            name: profile.displayName,
                        })
                    }
                }
                // Pass the user object to Passport
                done(null, user);
            } catch (err) {
                done(err, null)
            }
        }
    )
);

// Configure GitHub OAuth strategy
passport.use(
    new GitHubStrategy(
        {
            // Configuration options for GitHub strategy
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: '/api/auth/github/callback', // Callback URL after GitHub authentication
        },
        // Verification function that runs after successful GitHub authentication
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Fetch emails from GitHub API using accessToken
                const { data: emails } = await axios.get('https://api.github.com/user/emails', {
                    headers: {
                        Authorization: `token ${accessToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                });

                // Get primary verified email
                const primaryEmail = emails.find(email => email.primary && email.verified)?.email || email;

                if (!primaryEmail) {
                    return done(new Error('No verified email returned from Github'), null);
                }

                // Check if user already exists in database using GitHub ID
                let user = await User.findOne({ githubId: profile.id });

                if (!user) {
                    // If not found, try by email
                    user = await User.findOne({ email: primaryEmail });

                    if (user) {
                        // Link the existing account to GitHub
                        user.githubId = profile.id
                        await user.save();
                    } else {
                        // No user found - create a new one
                        user = await User.create({
                            email: profile.emails[0].value,
                            githubId: profile.id,
                            name: profile.displayName,
                        })
                    }
                    // If user doesn't exist, create a new user in database
                    /*user = await User.create({
                        email: profile.emails[0].value, // Get email from GitHub profile
                        githubId: profile.id, // GitHub's unique ID for the user
                        name: profile.displayName, // User's display name from GitHub
                    });*/
                }
                // Pass the user object to Passport
                done(null, user);
            } catch (err) {
                console.error('GitHub OAuth error:', err.message);
                done(err, null)
            }
        }
    )
);

// Serialize user information to store in session
// Only stores the user ID in the session to keep it small
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user information from session
// Takes the user ID stored in session and retrieves the full user object
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id); // Find user by ID in database
    done(null, user);
})