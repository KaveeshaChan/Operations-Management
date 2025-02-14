const express = require('express');
const updateFreightAgentsRoute = require('../controllers/userHandlingControllers/updateFreightAgents');
const updateOrderStatusRoute = require('../controllers/orderHandlingControllers/exporterHandlings/UpdateOrderStatus')

const router = express.Router();

router.use('/update-freight-agents', updateFreightAgentsRoute);
router.use('/order-status', updateOrderStatusRoute);

module.exports = router;