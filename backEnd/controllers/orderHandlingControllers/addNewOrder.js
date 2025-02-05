const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { addExportAirFreight, addExportLCL, addExportFCL } = require('./queries/addNewOrderExportQueries');
const { addImportAirFreight, addImportLCL, addImportFCL } = require('./queries/addNewOrderImportQueries');

const router = express.Router();

//export
router.post("/export-airFreight", async (req, res) => {
  
  const {
    orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate,
    deliveryTerm, type, cargoType, numberOfPallets, chargeableWeight, grossWeight,
    cargoCBM, targetDate, fileUpload, fileName, additionalNotes, userId, dueDate
  } = req.body;
  // Validate required fields
  if (
    !orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo ||
    !shipmentReadyDate || !deliveryTerm || !type || !cargoType || !chargeableWeight ||
    !grossWeight || !cargoCBM || !targetDate || !userId
  ) {
    return res.status(400).json({ message: "All required fields must be provided." });
  } 

  try {
    const pool = await poolPromise;

    // Check if orderNumber already exists
    const checkOrder = await pool
        .request()
        .input("orderNumber", sql.VarChar, orderNumber)
        .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
  
    if (checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "Order with this Order Number already exists." });
    }

    // Convert JSON to Buffer if fileUpload is provided
    const buffer = fileUpload ? Buffer.from(JSON.stringify(fileUpload)) : null;

    // Insert into the database
    const result = await pool
      .request()
      .input("orderType", sql.VarChar, orderType)
      .input("shipmentType", sql.NVarChar, shipmentType)
      .input("orderNumber", sql.VarChar, orderNumber)
      .input("from", sql.VarChar, routeFrom)
      .input("to", sql.VarChar, routeTo)
      .input("shipmentReadyDate", sql.VarChar, shipmentReadyDate)
      .input("deliveryTerm", sql.VarChar, deliveryTerm)
      .input("Type", sql.VarChar, type)
      .input("cargoType", sql.VarChar, cargoType)
      .input("numberOfPallets", sql.VarChar, numberOfPallets)
      .input("chargeableWeight", sql.VarChar, chargeableWeight)
      .input("grossWeight", sql.VarChar, grossWeight)
      .input("cargoCBM", sql.VarChar, cargoCBM)
      .input("targetDate", sql.VarChar, targetDate)
      .input("additionalNotes", sql.VarChar, additionalNotes || null)
      .input("documentData",sql.VarBinary, buffer)
      .input("documentName", sql.VarChar, fileName || null)
      .input("createdBy", sql.VarChar, userId)
      .input("dueDate", sql.Int, dueDate)
      .query(addExportAirFreight);

    res.status(201).json({
      message: "New Order added successfully.",
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Failed to add order. Internal Server Error." });
  }
});

router.post('/export-lcl', async (req, res) => {
  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, 
    numberOfPallets, palletCBM, cargoCBM, grossWeight, targetDate, additionalNotes, fileUpload, fileName, userId, dueDate } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !numberOfPallets || !palletCBM || !grossWeight || !cargoCBM || !targetDate || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Check if orderNumber already exists
    const checkOrder = await pool
    .request()
    .input("orderNumber", sql.VarChar, orderNumber)
    .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
  
    if (checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "Order with this Order Number already exists." });
    }

    // Convert JSON to Buffer if fileUpload is provided
    const buffer = fileUpload ? Buffer.from(JSON.stringify(fileUpload)) : null;

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.NVarChar, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.VarChar, orderNumber)
      .input('from', sql.VarChar, routeFrom)
      .input('to', sql.VarChar, routeTo)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, type)
      .input('numberOfPallets', sql.VarChar, numberOfPallets)
      .input('palletCBM', sql.VarChar, palletCBM)
      .input('cargoCBM', sql.VarChar, cargoCBM)
      .input('grossWeight', sql.VarChar, grossWeight)
      .input('targetDate', sql.VarChar, targetDate)
      .input("additionalNotes", sql.VarChar, additionalNotes || null)
      .input("documentData",sql.VarBinary, buffer)
      .input("documentName", sql.VarChar, fileName || null)
      .input("createdBy", sql.VarChar, userId)
      .input("dueDate", sql.Int, dueDate)
      .query(addExportLCL);

    res.status(201).json({
      message: 'New Order added successfully.'
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

router.post('/export-fcl', async (req, res) => {
  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, 
    numberOfContainers, targetDate, fileUpload, fileName, additionalNotes, userId, dueDate } = req.body;

  if (
    !orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !numberOfContainers || !targetDate || !userId
  ) {
    return res.status(400).json({ message: 'All fields are required.rg' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Check if orderNumber already exists
    const checkOrder = await pool
        .request()
        .input("orderNumber", sql.VarChar, orderNumber)
        .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
  
    if (checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "Order with this Order Number already exists." });
    }

    // Convert JSON to Buffer if fileUpload is provided
    const buffer = fileUpload ? Buffer.from(JSON.stringify(fileUpload)) : null;

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.NVarChar, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.VarChar, orderNumber)
      .input('from', sql.VarChar, routeFrom)
      .input('to', sql.VarChar, routeTo)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, type)
      .input('numberOfContainers', sql.VarChar, numberOfContainers)
      .input('targetDate', sql.VarChar, targetDate)
      .input("additionalNotes", sql.VarChar, additionalNotes || null)
      .input("documentData",sql.VarBinary, buffer)
      .input("documentName", sql.VarChar, fileName || null)
      .input("createdBy", sql.VarChar, userId)
      .input("dueDate", sql.Int, dueDate)
      .query(addExportFCL);

    res.status(201).json({
      message: 'New Order added successfully.',
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

//import
router.post('/import-airFreight', async (req, res) => {
  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, cargoType, 
    numberOfPallets, chargeableWeight, grossWeight, cargoCBM, LWHWithThePallet, productDescription, targetDate, additionalNotes,
    fileUpload, fileName, userId, dueDate } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !cargoType || !numberOfPallets || !chargeableWeight || !grossWeight || 
    !cargoCBM || !targetDate || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

        // Check if orderNumber already exists
        const checkOrder = await pool
        .request()
        .input("orderNumber", sql.VarChar, orderNumber)
        .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
      
        if (checkOrder.recordset[0].count > 0) {
          return res.status(400).json({ message: "Order with this Order Number already exists." });
        }
    
        // Convert JSON to Buffer if fileUpload is provided
        const buffer = fileUpload ? Buffer.from(JSON.stringify(fileUpload)) : null;

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.NVarChar, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.NVarChar, orderNumber)
      .input('from', sql.VarChar, routeFrom)
      .input('to', sql.VarChar, routeTo)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, type)
      .input('cargoType', sql.VarChar, cargoType)
      .input('numberOfPallets', sql.VarChar, numberOfPallets)
      .input('chargeableWeight', sql.VarChar, chargeableWeight)
      .input('grossWeight', sql.VarChar, grossWeight)
      .input('cargoCBM', sql.VarChar, cargoCBM)
      .input('LWHWithThePallet', sql.VarChar, LWHWithThePallet || null)
      .input('productDescription', sql.VarChar, productDescription || null)
      .input('targetDate', sql.VarChar, targetDate)
      .input('additionalNotes', sql.VarChar, additionalNotes || null)
      .input("documentData",sql.VarBinary, buffer)
      .input("documentName", sql.VarChar, fileName || null)
      .input("createdBy", sql.VarChar, userId)
      .input("dueDate", sql.Int, dueDate)
      .query(addImportAirFreight);

    res.status(201).json({
      message: 'New Order added successfully.'
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

router.post('/import-lcl', async (req, res) => {
  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, 
    numberOfPallets, palletCBM, cargoCBM, grossWeight, targetDate, productDescription, additionalNotes, fileUpload, fileName, userId, dueDate } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !numberOfPallets || !palletCBM || !grossWeight || !cargoCBM || !targetDate || !userId) {
    return res.status(400).json({ message: 'All fields are required. bck' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Check if orderNumber already exists
    const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
          
      if (checkOrder.recordset[0].count > 0) {
        return res.status(400).json({ message: "Order with this Order Number already exists." });
      }

      // Convert JSON to Buffer if fileUpload is provided
      const buffer = fileUpload ? Buffer.from(JSON.stringify(fileUpload)) : null;

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.NVarChar, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.NVarChar, orderNumber)
      .input('from', sql.VarChar, routeFrom)
      .input('to', sql.VarChar, routeTo)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, type)
      .input('numberOfPallets', sql.VarChar, numberOfPallets)
      .input('palletCBM', sql.VarChar, palletCBM)
      .input('cargoCBM', sql.VarChar, cargoCBM)
      .input('grossWeight', sql.VarChar, grossWeight)
      .input('targetDate', sql.VarChar, targetDate)
      .input('productDescription', sql.VarChar, productDescription)
      .input('additionalNotes', sql.VarChar, additionalNotes || null)
      .input("documentData",sql.VarBinary, buffer)
      .input("documentName", sql.VarChar, fileName || null)
      .input("createdBy", sql.VarChar, userId)
      .input("dueDate", sql.Int, dueDate)
      .query(addImportLCL);

    res.status(201).json({
      message: 'New Order added successfully.',
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

router.post('/import-fcl', async (req, res) => {
  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, 
    targetDate, numberOfContainers, productDescription, additionalNotes, fileUpload, fileName, userId, dueDate } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !numberOfContainers || !targetDate || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

      // Check if orderNumber already exists
      const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
          
      if (checkOrder.recordset[0].count > 0) {
        return res.status(400).json({ message: "Order with this Order Number already exists." });
      }
        
      // Convert JSON to Buffer if fileUpload is provided
      const buffer = fileUpload ? Buffer.from(JSON.stringify(fileUpload)) : null;

    // Insert the new order into the database
    const result = await pool
      .request()
      .input('orderType', sql.NVarChar, orderType)
      .input('shipmentType', sql.NVarChar, shipmentType)
      .input('orderNumber', sql.NVarChar, orderNumber)
      .input('from', sql.VarChar, routeFrom)
      .input('to', sql.VarChar, routeTo)
      .input('shipmentReadyDate', sql.VarChar, shipmentReadyDate)
      .input('deliveryTerm', sql.VarChar, deliveryTerm)
      .input('Type', sql.VarChar, type)
      .input('numberOfContainers', sql.VarChar, numberOfContainers)
      .input('productDescription', sql.VarChar, productDescription)
      .input('targetDate', sql.VarChar, targetDate)
      .input('additionalNotes', sql.VarChar, additionalNotes || null)
      .input("documentData",sql.VarBinary, buffer)
      .input("documentName", sql.VarChar, fileName || null)
      .input("createdBy", sql.VarChar, userId)
      .input("dueDate", sql.Int, dueDate)
      .query(addImportFCL);

    res.status(201).json({
      message: 'New Order added successfully.'
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add order. Internal Server Error.' });
  }
});

module.exports = router;
