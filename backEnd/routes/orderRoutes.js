const express = require('express');
const { authorizeRoles } = require('./../middlewares/authMiddleware');
const addNewOrderRoute = require('../controllers/orderHandlingControllers/addNewOrder');
const addQuotationRoute = require('../controllers/orderHandlingControllers/addQuotations')

const router = express.Router();

router.use('/add-new-order', addNewOrderRoute);
router.use('/add-quoatation', authorizeRoles(['coordinator']), addQuotationRoute);

module.exports = router;