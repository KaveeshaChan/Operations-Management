const express = require('express');
const addNewOrderRoute = require('../controllers/orderHandlingControllers/addNewOrder');
const viewOrdersToAgents = require('../controllers/orderHandlingControllers/viewOrdersToAgents');

const router = express.Router();

router.use('/add-new-order', addNewOrderRoute);

module.exports = router;