// Import mongoose - an ODM (Object Data Modeling) library for MongoDB
const mongoose = require('mongoose');

// Import the Express app configuration from app.js
const app = require('./app');

// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Get MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB using the connection URI
mongoose
  .connect(MONGO_URI)
  .then(() => {
    // If connection is successful:
    console.log('MongoDB connected');

    // Start the Express server on the specified port
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // If connection fails, log the error
    console.error('MongoDB connection error:', err);
  });