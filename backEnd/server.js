const express = require('express');
const cors = require('cors'); // Added for CORS support
const dotenv = require('dotenv');
const sql = require('./config/database'); // Assuming it connects to the DB
const { authorizeRoles } = require('./middlewares/authMiddleware');
const registerRoute = require('./auth/register');
const loginRoute = require('./auth/login');
const addFreightAgentRoute = require('./controllers/addingUsers/addFreightAgentController')
const addFreightAgentCoordinatorRoute = require('./controllers/addingUsers/addFACoordinatorController')
const addMainUserRoute = require('./controllers/addingUsers/addMainUserController')
const orderHandlingRoute = require('./routes/orderRoutes')

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5056;

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'], // Specify allowed methods
    credentials: true, // Allow credentials like cookies, authorization headers
}));

// Routes
app.use('/api', registerRoute);
app.use('/api', loginRoute);
app.use('/api/add-freight-agent', authorizeRoles(['admin', 'mainUser']), addFreightAgentRoute);
app.use('/api/addFreightAgentCoordinator', authorizeRoles(['admin', 'mainUser']), addFreightAgentCoordinatorRoute);
app.use('/api/add-main-user', authorizeRoles(['admin']), addMainUserRoute);
app.use('/api/orderHandling', authorizeRoles(['admin', 'mainUser']), orderHandlingRoute);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
