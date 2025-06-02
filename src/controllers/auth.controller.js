const User = require('../models/user.model'); // User model for database operations
const QRCode = require('qrcode'); // Library for generating QR codes
const authService = require('../services/auth.service'); // Service layer for authentication log

const crypto = require('crypto'); // Node.js crypto module for generating random tokens
const sendEmail = require('../utils/sendEmail'); // Custom email sending utility
const getPasswordResetEmailHTML = require('../utils/emails/passwordResetTemplate') // Email Template


// Controller for user registration
exports.register = async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Call auth service to register the user
    const user = await authService.register(email, password);

    // Return success response with the new user's ID
    res.status(201).json({ success: 'User registered', userId: user._id });
};

// Controller for user login
exports.login = async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find user by email in database
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (!user || !(await authService.verifyPassword(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If 2FA is enabled for this user, return response indicating 2FA is required
    if (user.is2FAEnabled) {
        return res.status(200).json({ 
          message: '2FA required', 
          require2FA: true, 
          userId: user._id 
        });
    
    }

    // If no 2FA is needed, generate and return JWT token
    const token = authService.generateToken(user);
    res.json({ token });
};

// Controller for setting up Two-Factor Authentication (2FA)
exports.setup2FA = async (req, res) => {
    try {
        // Get userId from request body
        const { userId } = req.body;

        // Find user by ID
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 2FA secret for this user
        const secret = authService.generate2FASecret(user.email);

        // Save the secret to the user document
        user.twoFASecret = secret.base32;
        await user.save();

        // Generate QR code URL for the OTP auth URI
        const qrDataURL = await QRCode.toDataURL(secret.otpauth_url);

        // Return QR code image URL and the secret (for manual entry)
        res.json({ 
          qrCode: qrDataURL, 
          secret: secret.base32 
        });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Failed to generate 2FA QR code' });
    }
};

// Controller for verifying 2FA token
exports.verify2FA = async (req, res) => {
    // Get userId and token from request body
    const { userId, token } = req.body

    // Find user by ID
    const user = await User.findById(userId);

    // Verify if the provided token matches the expected value
    const valid = authService.verify2FAToken(user.twoFASecret, token);

    // If token is invalid, return error
    if (!valid) return res.status(401).json({ message: 'Invalid 2FA token' });

    // If token is valid, enable 2FA for this user
    user.is2FAEnabled = true;
    await user.save();

    // Generate and return JWT token
    const jwtToken = authService.generateToken(user);
    res.json({ token: jwtToken });
};


// Controller function to handle refresh token requests
// This endpoint is used to get new access and refresh tokens when the access token expires
exports.refreshToken = async (req, res) => {
    const { token } = req.body; // Extract the refresh token from the request body

    try {
        // Verify the refresh token
        // Checks if the token is valid and not expired
        const payload = authService.verifyRefreshToken(token);

        // Find the user associated with the token using the ID from the payload
        const user = await User.findById(payload.id);

        // Check if:
        // 1. User exists
        // 2. The stored refresh token matches the one provided
        // If either check fails, return 401 Unauthorized
        if (!user || user.refreshToken !== token) return res.status(401).send();

        // Generate new tokens:
        // 1. New short-lived access token
        // 2. New long-lived refresh token
        const newAccessToken = authService.generateToken(user);
        const newRefreshToken = authService.generateRefreshToken(user);

        // Update the user's refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save();

        // Return both new tokens to the client
        res.json({
          accessToken: newAccessToken,      // New access token
          refreshToken: newRefreshToken,    // New refresh token 
        });
    } catch {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
}

// Controller function to handle forgot password requests
exports.forgotPassword = async (req, res) => {
    // Extract email from request body
    const { email } = req.body;

    // Find user in database by email
    const user = await User.findOne({ email });

    // If user not found, return 404 error
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a secure random token (32 bytes) and convert to hex string
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration time to 1 hour from now
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour

    // Store the token and expiration time in the user document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;

    // Save the updated user document to the database
    await user.save();

    // Create a password reset link that points to the frontend reset page
    // with the token as a query parameter.
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = getPasswordResetEmailHTML(resetLink, user.name);

    await sendEmail({
        to: email, // Recipient email
        subject: 'Reset Your Password', // Email subject
        html // Email content with clickable link
    });

    // Return success response
    res.json({ message: 'Password reset email sent' });
}

// Controller function to handle password reset requests
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    // Find user by reset password token and check if it is still valid
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token'})
    }
    // If user found, hash the new password
    user.password = await authService.hashPassword(newPassword);

    // Clear the reset password token and expiration time
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save(); // Save the updated user document

    // Return success response
    res.json({ message: 'Password reset successful. You can now login.'})
}