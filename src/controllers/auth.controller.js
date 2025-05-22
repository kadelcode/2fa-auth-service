const User = require('../models/user.model'); // User model for database operations
const QRCode = require('qrcode'); // Library for generating QR codes
const authService = require('../services/auth.service'); // Service layer for authentication log

// Controller for user registration
exports.register = async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Call auth service to register the user
    const user = await authService.register(email, password);

    // Return success response with the new user's ID
    res.status(201).json({ message: 'User registered', userId: user._id });
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
    // Get userId from request body
    const { userId } = req.body;

    // Find user by ID
    const user = await User.findById(userId);

    // Generate 2FA secret for this user
    const secret = authService.generate2FASecret(user.email);

    // Save the secret to the user document
    user.twoFASecret = secret.base32;
    await user.save();

    // Generate QR code URL for the OTP auth URI
    const qrDataURL = await QRCode.toDataURL(secret.otpauth_url);

    // Return QR code image URL and the secret (for manual entry)
    res.json({ qrCode: qrDataURL, secret: secret.base32 });
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