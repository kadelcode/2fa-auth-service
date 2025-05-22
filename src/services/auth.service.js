const bcrypt = require('bcrypt'); // For password hashing and verification
const jwt = require('jsonwebtoken'); // For generating JSON Web Tokens (JWT)
const speakeasy = require('speakeasy'); // For 2FA (Two-Factor Authentication) functionality
const User = require('../models/user.model'); // User model for database operations

/**
 * Register a new user with email and password
 * @param {string} email - User's email 
 * @param {string} password - User's plain text password
 * @returns {Promise<User>} - The created user document
 */
const register = async (email, password) => {
    // Hash the password with a salt round of 10 (higher is more secure but slower)
    const hashed = await bcrypt.hash(password, 10);

    // Create a new user instance with email and hashed password
    const user = new User({ email, password: hashed });

    // Save the user to the database
    await user.save();

    // Return the created user
    return user;
};

/**
 * Verify if a plain text password matches the hashed password
 * @param {string} password  - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {Promise<boolean>} - True if password match, false otherwise
 */
const verifyPassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token for a user
 * @param {User} user - User object containing _id and email
 * @returns {string} - Generated JWT token
 */
const generateToken = (user) => {
    // Create a token with user ID and email as payload
    // Signed with the JWT_SECRET from environment variables
    // Token expires in 1 hour
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

/**
 * Generate a secret key for 2FA (Time-based One-Time Password)
 * @param {string} email - User's email to associate with the secret
 * @returns {speakeasy.GeneratedSecret} - Generated secret and related data
 */
const generate2FASecret = (email) => {
    // Generate a secret key with the app name and user's email
    return speakeasy.generateSecret({
      name: `MyApp (${email})` // This appears in authenticator apps
    });
};

/**
 * Verify a 2FA token against the user's secret
 * @param {string} secret - User's base32 encoded 2FA secret
 * @param {string} token - 2FA token to verify (usually 6 digits from authenticator app)
 * @returns {boolean} - True if token is valid, false otherwise
 */
const verify2FAToken = (secret, token) => {
    // Verify the token using Time-based One-Time Password algorithm
    return speakeasy.totp.verify({
      secret, // The user's secret key
      encoding: 'base32', // Encoding format of the secret
      token // The token to verify (from authenticator app)
    });
}

// Export all the functions to be used in other files
module.exports = {
    register,
    verifyPassword,
    generateToken,
    generate2FASecret,
    verify2FAToken,
};