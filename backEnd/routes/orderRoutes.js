const express = require('express');
const { authorizeRoles } = require('./../middlewares/authMiddleware');
const addNewOrderRoute = require('../controllers/orderHandlingControllers/addNewOrder');
const addQuotationRoute = require('../controllers/orderHandlingControllers/addQuotations')
const selectBestQuote = require('../controllers/orderHandlingControllers/exporterHandlings/handleSelectedQuoteForOrder')

const router = express.Router();

router.use('/add-new-order', authorizeRoles(['admin', 'mainUser']), addNewOrderRoute);
router.use('/add-quoatation', authorizeRoles(['coordinator']), addQuotationRoute);
router.use('/select-best-quote', authorizeRoles(['admin', 'mainUser']), selectBestQuote)

module.exports = router;