const express = require('express');
const viewFreightAgentsRoute = require('../controllers/userHandlingControllers/viewFreightAgents');

const router = express.Router();

router.use('/view-freight-agents', viewFreightAgentsRoute);

module.exports = router;