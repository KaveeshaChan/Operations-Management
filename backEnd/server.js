const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { authorizeRoles } = require('./middlewares/authMiddleware');
const cron = require('node-cron');
const path = require('path');
const { poolPromise } = require('./config/database');

// Route imports
const registerRoute = require('./auth/register');
const loginAndLogoutRoute = require('./auth/loginAndLogout');
const addFreightAgentRoute = require('./controllers/addingUsers/addFreightAgentController');
const addFreightAgentCoordinatorRoute = require('./controllers/addingUsers/addFACoordinatorController');
const addMainUserRoute = require('./controllers/addingUsers/addMainUserController');
const orderHandlingRoute = require('./routes/orderRoutes');
const selectRoute = require('./routes/selectRoutes');
const updateRoutes = require('./routes/updateRoutes');
const emailRoute = require('./routes/emailRoutes')

require("./controllers/orderHandlingControllers/exporterHandlings/updateOrderStatusAuto");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5056;

// Database connection
require('./config/database'); // Ensure DB connection is established

// Serve static images from 'src/images/logo'
app.use('/images/logo', express.static(path.join(__dirname, 'src/images/logo')));

// Middleware
app.use(express.urlencoded({ extended: true, limit: '50mb'  })); // Parse URL-encoded bodies
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with an increased limit

// Multer setup (for file uploads)
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
app.use(upload.single('documentDetails')); // Automatically handle single-file uploads named 'documentDetails'

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.100.8:8087'
];

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., curl or mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
// Routes
app.use('/api', registerRoute);
app.use('/api', loginAndLogoutRoute);
app.use('/api', emailRoute)
app.use('/api/add-freight-agent', authorizeRoles(['admin', 'mainUser']), addFreightAgentRoute);
app.use('/api/addFreightAgentCoordinator', authorizeRoles(['admin', 'mainUser']), addFreightAgentCoordinatorRoute);
app.use('/api/add-main-user', authorizeRoles(['admin']), addMainUserRoute);
app.use('/api/orderHandling', authorizeRoles(['admin', 'mainUser', 'freightAgent', 'coordinator']), orderHandlingRoute);
app.use('/api/select', authorizeRoles(['admin', 'mainUser', 'freightAgent', 'coordinator']), selectRoute)
app.use('/api/update', authorizeRoles(['admin', 'mainUser', 'freightAgent', 'coordinator']), updateRoutes)

// Schedule the cleanup job to run at midnight every day
cron.schedule('0 0 * * *', async () => {
  try {
    const pool = await poolPromise;
    await pool.request().query('DELETE FROM TokenBlacklist WHERE ExpirationDateTime < GETDATE()');
    console.log('Expired tokens cleaned up.');
  } catch (err) {
    console.error('Cleanup error:', err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
