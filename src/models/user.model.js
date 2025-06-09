// Import the mongoose library which is used to interact with MongoDB
const mongoose = require('mongoose');

// Define a schema for the User model
// A schema defines the structure of documents in a MongoDB collection
const userSchema = new mongoose.Schema({
    // Email field definition:
    email: { 
      type: String,     // Must be a string
      unique: true      // Must be unique across all documents in the collection
    },

    // Password field (stored as a string)
    password: String,

    // Social auth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // 2FA (Two-Factor Authentication) enabled flag
    is2FAEnabled: { 
      type: Boolean,    // Must be a boolean
      default: true,    // Default value if false if not specified
    },

    // Secret key used for 2FA (when 2FA is enabled)
    twoFASecret: String,

    // Refresh Token
    refreshToken: String,

    // QR Code URL for 2FA setup
    resetPasswordToken: String,

    // Expiration date for the reset password token
    resetPasswordExpires: Date,
});

// Create and export the User model based on the schema
// mongoose.model() creates a model which represents a MongoDB collection
// The first argument 'User' is the singular name of the collection
// (Mongoose will look for 'users' collection in DB)
// The second argument is the schema defined
module.exports = mongoose.model('User', userSchema);