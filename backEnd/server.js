const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { authorizeRoles } = require('./middlewares/authMiddleware');

// Route imports
const registerRoute = require('./auth/register');
const loginRoute = require('./auth/login');
const addFreightAgentRoute = require('./controllers/addingUsers/addFreightAgentController');
const addFreightAgentCoordinatorRoute = require('./controllers/addingUsers/addFACoordinatorController');
const addMainUserRoute = require('./controllers/addingUsers/addMainUserController');
const orderHandlingRoute = require('./routes/orderRoutes');
const selectRoute = require('./routes/selectRoutes')
const updateRoutes = require('./routes/updateRoutes')

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5056;

// Database connection
require('./config/database'); // Ensure this establishes a connection to your DB

// Multer setup (for file uploads)
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
app.use(upload.single('documentDetails')); // Automatically handle single-file uploads named 'documentDetails'

// Middleware
app.use(express.urlencoded({ extended: true, limit: '50mb'  })); // Parse URL-encoded bodies
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with an increased limit


// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Dynamic origin from .env
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Support cookies if needed
  })
);

// Routes
app.use('/api', registerRoute);
app.use('/api', loginRoute);
app.use('/api/add-freight-agent', authorizeRoles(['admin', 'mainUser']), addFreightAgentRoute);
app.use('/api/addFreightAgentCoordinator', authorizeRoles(['admin', 'mainUser']), addFreightAgentCoordinatorRoute);
app.use('/api/add-main-user', authorizeRoles(['admin']), addMainUserRoute);
app.use('/api/orderHandling', authorizeRoles(['admin', 'mainUser', 'commonUser']), orderHandlingRoute);
app.use('/api/select', authorizeRoles(['admin', 'mainUser', 'commonUser']), selectRoute)
app.use('/api/update', authorizeRoles(['admin', 'mainUser']), updateRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
