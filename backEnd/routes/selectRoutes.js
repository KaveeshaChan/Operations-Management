const express = require('express');
const { authorizeRoles } = require('./../middlewares/authMiddleware');
const viewFreightAgentsRoute = require('../controllers/userHandlingControllers/viewFreightAgents');
const viewOrdersToAgents = require('../controllers/orderHandlingControllers/viewOrdersToAgents')
const viewQuotesForOrder = require('../controllers/orderHandlingControllers/exporterHandlings/viewQuotesForOrder')
const viewMainUsers = require('../controllers/userHandlingControllers/viewMainUsers')

const router = express.Router();

router.use('/view-freight-agents', viewFreightAgentsRoute);
router.use('/view-orders', viewOrdersToAgents);
router.use('/view-quotes', viewQuotesForOrder);
router.use('/view-mainUsers', viewMainUsers)

module.exports = router;