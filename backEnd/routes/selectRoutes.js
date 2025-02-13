const express = require('express');
const { authorizeRoles } = require('./../middlewares/authMiddleware');
const viewFreightAgentsRoute = require('../controllers/userHandlingControllers/viewFreightAgents');
const viewOrdersToAgents = require('../controllers/orderHandlingControllers/viewOrdersToAgents')

const router = express.Router();

router.use('/view-freight-agents', viewFreightAgentsRoute);
router.use('/view-orders', viewOrdersToAgents)


module.exports = router;