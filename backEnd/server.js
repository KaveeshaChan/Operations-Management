const express = require('express');
const sql = require('./config/database');
const registerRoute = require('./auth/register');
const loginRoute = require('./auth/login')
require('dotenv').config();

// // Load environment variables
// dotenv.config();

const app = express();
const port = 5056;

// Middleware
app.use(express.json());

// Routes
app.use('/api', registerRoute);
app.use('/api', loginRoute);

// Start server
const PORT = process.env.PORT || 5056;
app.listen(PORT, () => {
    console.log(`Server is running on port ${port}`);
});
