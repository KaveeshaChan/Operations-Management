const express = require('express');
const updateFreightAgentsRoute = require('../controllers/userHandlingControllers/updateFreightAgents');
const updateOrderStatusRoute = require('../controllers/orderHandlingControllers/exporterHandlings/UpdateOrderStatus')
const cancelOrder = require('../controllers/orderHandlingControllers/exporterHandlings/cancelOrder')

const router = express.Router();

router.use('/update-freight-agents', updateFreightAgentsRoute);
router.use('/order-status', updateOrderStatusRoute);
router.use('/cancel-order', cancelOrder)

module.exports = router;