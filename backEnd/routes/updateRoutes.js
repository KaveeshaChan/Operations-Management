const express = require('express');
const { authorizeRoles } = require('../middlewares/authMiddleware');
const updateFreightAgentsRoute = require('../controllers/userHandlingControllers/updateFreightAgents');
const updateOrderStatusRoute = require('../controllers/orderHandlingControllers/exporterHandlings/UpdateOrderStatus')
const cancelOrder = require('../controllers/orderHandlingControllers/exporterHandlings/cancelOrder')
const updatePreQuotes = require('../controllers/orderHandlingControllers/updatePreQuotations')

const router = express.Router();

router.use('/update-freight-agents',authorizeRoles(['admin', 'mainUser']), updateFreightAgentsRoute);
router.use('/order-status',authorizeRoles(['admin', 'mainUser']), updateOrderStatusRoute);
router.use('/cancel-order',authorizeRoles(['admin', 'mainUser']), cancelOrder)
router.use('/update-preQuotes',authorizeRoles(['freightAgent', 'coordinator']), updatePreQuotes)

module.exports = router;