// Import the Express framework to create a web server
const express = require('express');

const passport = require('passport');
require('./config/passport'); // Import passport strategies

// Import dotenv to load environment variables from a `.env` file
const dotenv = require('dotenv');

// Import cors to enable Cross-Origin Resource Sharing
const cors = require('cors');

// Import the authentication routes from a separate file
const authRoutes = require('./routes/auth.routes');

// Load environment variables from .env file into process.env
dotenv.config();

// Create an Express application instance
const app = express();

// Enable CORS for all routes
app.use(cors());

// Add middleware to parse incoming JSON requests
// This allows the server to automatically parse JSON data sent in request bodies
app.use(express.json());

// Mount the authentication routes under the '/api/auth' path
// Any request starting with '/api/auth' will be handled by authRoutes
app.use('/api/auth', authRoutes);

// app.use(require('express-session')({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
// app.use(passport.session());

// Export the Express app so it can be used in other files (like server.js)
// This makes the app configurable and testable
module.exports = app;