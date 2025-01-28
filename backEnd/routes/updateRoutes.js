const express = require('express');
const updateFreightAgentsRoute = require('../controllers/userHandlingControllers/updateFreightAgents');

const router = express.Router();

router.use('/update-freight-agents', updateFreightAgentsRoute);

module.exports = router;