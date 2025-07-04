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
      name: `2FA Auth App (${email})` // This appears in authenticator apps
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

/**
 * Function to generate a refresh token for a user
 * Refresh tokens are long-lived tokens used to obtain new access tokens
 * @param {string} user - user's ID
 * @returns the signed JWT (JSON Web Token ) containing the user's ID
 * Signed with the application's JWT_SECRET from environment variables
 */
const generateRefreshToken = (user) => {
    return jwt.sign({ 
      id: user._id },           // Payload containing user identifier
      process.env.JWT_SECRET,   // Secret key for signing the token 
      { expiresIn: '7d' }       // Token expiration time (7 days)
    );
};

// Function to verify a refresh token
// Used to check if a refresh token is valid and hasn't been tampered with
const verifyRefreshToken = (token) => {
    return jwt.verify(
      token,                    // The refresh token to verify
      process.env.JWT_SECRET    // Secret key used to verify the signature
    );
};

// Export all the functions to be used in other files
module.exports = {
    register,
    verifyPassword,
    generateToken,
    generate2FASecret,
    verify2FAToken,
    generateRefreshToken,
    verifyRefreshToken,
};