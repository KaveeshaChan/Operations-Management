const express = require('express');
const { authorizeRoles } = require('./../middlewares/authMiddleware');
const sendEmail = require('../controllers/emailHandlingControllers/emailController');

const router = express.Router();

router.use('/send-email', sendEmail);

module.exports = router;