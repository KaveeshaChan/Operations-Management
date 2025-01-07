const express = require('express');
const addNewDocumentRoute = require('../controllers/documentHandling/addNewDocument');

const router = express.Router();

router.use('/add-new-document', addNewDocumentRoute);

module.exports = router;