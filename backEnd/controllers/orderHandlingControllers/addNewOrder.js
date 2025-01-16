const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { addExportAirFreight, addExportLCL, addExportFCL } = require('./queries/addNewOrderExportQueries');
const { addImportAirFreight, addImportLCL, addImportFCL } = require('./queries/addNewOrderImportQueries');

const router = express.Router();

//export
router.post('/export-airFreight', async (req, res) => {
  const { orderType, shipmentType, orderNumber, from, to, shipmentReadyDate, deliveryTerm, Type, cargoType, 
    numberOfPallets, chargeableWeight, grossWeight, cargoCBM, targetDate, documentDetails } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !from || !to || !shipmentReadyDate || 
    !deliveryTerm || !Type || !cargoType || !numberOfPallets || !chargeableWeight || !grossWeight || !cargoCBM || !targetDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.Int, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.Date, orderNumber)
      .input('from', sql.VarChar, from)
      .input('to', sql.VarChar, to)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, Type)
      .input('cargoType', sql.VarChar, cargoType)
      .input('numberOfPallets', sql.VarChar, numberOfPallets)
      .input('chargeableWeight', sql.VarChar, chargeableWeight)
      .input('grossWeight', sql.VarChar, grossWeight)
      .input('cargoCBM', sql.VarChar, cargoCBM)
      .input('targetDate', sql.VarChar, targetDate)
      .input('documentDetails', sql.VarChar, documentDetails)
      .query(addExportAirFreight);

    res.status(201).json({
      message: 'New Order added successfully.',
      orderId: result.recordset.insertId,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

router.post('/export-lcl', async (req, res) => {
  const { orderType, shipmentType, orderNumber, from, to, shipmentReadyDate, deliveryTerm, Type, 
    numberOfPallets, palletCBM, cargoCBM, grossWeight, targetDate, documentDetails } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !from || !to || !shipmentReadyDate || 
    !deliveryTerm || !Type || !numberOfPallets || !palletCBM || !grossWeight || !cargoCBM || !targetDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.Int, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.Date, orderNumber)
      .input('from', sql.VarChar, from)
      .input('to', sql.VarChar, to)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, Type)
      .input('numberOfPallets', sql.VarChar, numberOfPallets)
      .input('palletCBM', sql.VarChar, palletCBM)
      .input('cargoCBM', sql.VarChar, cargoCBM)
      .input('grossWeight', sql.VarChar, grossWeight)
      .input('targetDate', sql.VarChar, targetDate)
      .input('documentDetails', sql.VarChar, documentDetails)
      .query(addExportLCL);

    res.status(201).json({
      message: 'New Order added successfully.',
      orderId: result.recordset.insertId,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

router.post('/export-fcl', async (req, res) => {
  const { orderType, shipmentType, orderNumber, from, to, shipmentReadyDate, deliveryTerm, Type, 
    numberOfContainers, targetDate, documentDetails } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !from || !to || !shipmentReadyDate || 
    !deliveryTerm || !Type || !numberOfContainers || !targetDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.Int, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.Date, orderNumber)
      .input('from', sql.VarChar, from)
      .input('to', sql.VarChar, to)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, Type)
      .input('numberOfContainers', sql.VarChar, numberOfContainers)
      .input('targetDate', sql.VarChar, targetDate)
      .input('documentDetails', sql.VarChar, documentDetails)
      .query(addExportFCL);

    res.status(201).json({
      message: 'New Order added successfully.',
      orderId: result.recordset.insertId,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

//import
router.post('/import-airFreight', async (req, res) => {
  const { orderType, shipmentType, orderNumber, from, to, shipmentReadyDate, deliveryTerm, Type, cargoType, 
    numberOfPallets, chargeableWeight, grossWeight, cargoCBM, LWHWithThePallet, productDescription, targetDate, documentDetails } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !from || !to || !shipmentReadyDate || 
    !deliveryTerm || !Type || !cargoType || !numberOfPallets || !chargeableWeight || !grossWeight || !cargoCBM || !targetDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.Int, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.Date, orderNumber)
      .input('from', sql.VarChar, from)
      .input('to', sql.VarChar, to)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, Type)
      .input('cargoType', sql.VarChar, cargoType)
      .input('numberOfPallets', sql.VarChar, numberOfPallets)
      .input('chargeableWeight', sql.VarChar, chargeableWeight)
      .input('grossWeight', sql.VarChar, grossWeight)
      .input('cargoCBM', sql.VarChar, cargoCBM)
      .input('LWHWithThePallet', sql.VarChar, LWHWithThePallet)
      .input('productDescription', sql.VarChar, productDescription)
      .input('targetDate', sql.VarChar, targetDate)
      .input('documentDetails', sql.VarChar, documentDetails)
      .query(addImportAirFreight);

    res.status(201).json({
      message: 'New Order added successfully.',
      orderId: result.recordset.insertId,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

router.post('/import-lcl', async (req, res) => {
  const { orderType, shipmentType, orderNumber, from, to, shipmentReadyDate, deliveryTerm, Type, 
    numberOfPallets, palletCBM, cargoCBM, grossWeight, targetDate,productDescription, documentDetails } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !from || !to || !shipmentReadyDate || 
    !deliveryTerm || !Type || !numberOfPallets || !palletCBM || !grossWeight || !cargoCBM || !targetDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.Int, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.Date, orderNumber)
      .input('from', sql.VarChar, from)
      .input('to', sql.VarChar, to)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, Type)
      .input('numberOfPallets', sql.VarChar, numberOfPallets)
      .input('palletCBM', sql.VarChar, palletCBM)
      .input('cargoCBM', sql.VarChar, cargoCBM)
      .input('grossWeight', sql.VarChar, grossWeight)
      .input('targetDate', sql.VarChar, targetDate)
      .input('productDescription', sql.VarChar, productDescription)
      .input('documentDetails', sql.VarChar, documentDetails)
      .query(addImportLCL);

    res.status(201).json({
      message: 'New Order added successfully.',
      orderId: result.recordset.insertId,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

router.post('/import-fcl', async (req, res) => {
  const { orderType, shipmentType, orderNumber, from, to, shipmentReadyDate, deliveryTerm, Type, 
    numberOfContainers, productDescription, targetDate, documentDetails } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !from || !to || !shipmentReadyDate || 
    !deliveryTerm || !Type || !numberOfContainers || !targetDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.Int, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.Date, orderNumber)
      .input('from', sql.VarChar, from)
      .input('to', sql.VarChar, to)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, Type)
      .input('numberOfContainers', sql.VarChar, numberOfContainers)
      .input('productDescription', sql.VarChar, productDescription)
      .input('targetDate', sql.VarChar, targetDate)
      .input('documentDetails', sql.VarChar, documentDetails)
      .query(addImportFCL);

    res.status(201).json({
      message: 'New Order added successfully.',
      orderId: result.recordset.insertId,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

module.exports = router;
