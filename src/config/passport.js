// Import required modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User');

// Configure Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy(
        {
            // Configuration options for Google strategy
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback', // Callback URL after Google authentication
        },
        // Verification function that runs after successful Google authentication
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in database using Google ID
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // If user doesn't exist, create a new user in database
                    user = await User.create({
                        email: profile.emails[0].value, // Get email from Google profile
                        googleId: profile.id, // Google's unique ID for the user
                        name: profile.displayName, // User's display name from Google
                    });
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
            callbackURL: '/auth/github/callback', // Callback URL after GitHub authentication
        },
        // Verification function that runs after successful GitHub authentication
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in database using GitHub ID
                let user = await User.findOne({ githubId: profile.id });

                if (!user) {
                    // If user doesn't exist, create a new user in database
                    user = await User.create({
                        email: profile.emails[0].value, // Get email from GitHub profile
                        githubId: profile.id, // GitHub's unique ID for the user
                        name: profile.displayName, // User's display name from GitHub
                    });
                }
                // Pass the user object to Passport
                done(null, user);
            } catch (err) {
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