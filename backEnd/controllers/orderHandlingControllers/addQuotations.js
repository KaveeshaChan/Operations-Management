const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { addExportAirFreight, addExportLCL, addExportFCL } = require('./queries/quotationQueries/addNewExportQuotationQuery');
const { addImportAirFreight, addImportLCL, addImportFCL } = require('./queries/addNewOrderQueries/addNewOrderImportQueries');

const router = express.Router();

//export
router.post("/export-airFreight", async (req, res) => {
  
  const {
    orderNumber, netFreight, AWB, HAWB, airLine, transShipmentPort, transitTime, vesselOrFlightDetails,
    totalFreight, validityTime
  } = req.body;
  const { userId, agentID } = req.user;
  // Validate required fields
  if (
    !orderNumber || !netFreight || !AWB || !HAWB ||
    !airLine || !validityTime || !totalFreight
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
  
    if (!checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Insert into the database
    await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .input("AgentID", sql.Int, agentID)
      .input("netFreight", sql.Decimal, netFreight)
      .input("transShipmentPort", sql.VarChar, transShipmentPort)
      .input("transitTime", sql.Int, transitTime)
      .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
      .input("totalFreight", sql.Decimal, totalFreight)
      .input("validityTime", sql.Int, validityTime)
      .input("airLine", sql.VarChar, airLine)
      .input("AWB", sql.VarChar, AWB)
      .input("HAWB", sql.VarChar, HAWB)
      .input("createdBy", sql.Int, userId)
      .query(addExportAirFreight);

    res.status(201).json({
      message: "Quotation added successfully.",
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Failed to add quotation. Internal Server Error." });
  }
});

router.post('/export-lcl', async (req, res) => {
  const { orderNumber, transShipmentPort, transitTime, vesselOrFlightDetails, validityTime, netFreight, totalFreight } = req.body;

  const { userId, agentID } = req.user;

  if (!orderNumber || !validityTime || !netFreight) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Check if orderNumber already exists
    const checkOrder = await pool
    .request()
    .input("orderNumber", sql.VarChar, orderNumber)
    .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
  
    if (!checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Insert the new order into the database
    await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .input("AgentID", sql.Int, agentID)
      .input("transShipmentPort", sql.VarChar, transShipmentPort)
      .input("transitTime", sql.Int, transitTime)
      .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
      .input("validityTime", sql.Int, validityTime)
      .input("netFreight", sql.Decimal, netFreight)
      .input("totalFreight", sql.Decimal, totalFreight)
      .input("createdBy", sql.Int, userId)
      .query(addExportLCL);

    res.status(201).json({
      message: 'Quotation added successfully.'
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.' });
  }
});

router.post('/export-fcl', async (req, res) => {
  const { orderNumber, netFreight, DTHC, freeTime, transShipmentPort, carrier, transitTime, vesselOrFlightDetails, validityTime } = req.body;

  const { userId, agentID } = req.user;

  if (!orderNumber || !validityTime || !netFreight) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Check if orderNumber already exists
    const checkOrder = await pool
    .request()
    .input("orderNumber", sql.VarChar, orderNumber)
    .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
  
    if (!checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Insert the new order into the database
    await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .input("AgentID", sql.Int, agentID)
      .input("netFreight", sql.Decimal, netFreight)
      .input("DTHC", sql.Decimal, DTHC)
      .input("freeTime", sql.Int, freeTime)
      .input("transShipmentPort", sql.VarChar, transShipmentPort)
      .input("carrier", sql.VarChar, carrier)
      .input("transitTime", sql.Int, transitTime)
      .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
      .input("validityTime", sql.Int, validityTime)
      .input("createdBy", sql.Int, userId)
      .query(addExportFCL);

    res.status(201).json({
      message: 'Quotation added successfully.'
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.' });
  }
});

//import
router.post("/import-airFreight", async (req, res) => {
  
  const {
    orderNumber, airFreightCost, AWB, carrier, transitTime, vesselOrFlightDetails, validityTime, totalFreight
  } = req.body;

  const { userId, agentID } = req.user;

  // Validate required fields
  if (
    !orderNumber || !carrier || !AWB || !totalFreight
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
  
    if (!checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Insert into the database
    await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .input("AgentID", sql.Int, agentID)
      .input("airFreightCost", sql.Decimal, airFreightCost)
      .input("AWB", sql.VarChar, AWB)
      .input("carrier", sql.VarChar, carrier)
      .input("transitTime", sql.Int, transitTime)
      .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
      .input("validityTime", sql.Int, validityTime)
      .input("totalFreight", sql.Decimal, totalFreight)
      .input("createdBy", sql.Int, userId)
      .query(addImportAirFreight);

    res.status(201).json({
      message: "Quotation added successfully.",
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Failed to add quotation. Internal Server Error." });
  }
});

router.post('/import-lcl', async (req, res) => {
  const { orderNumber, netFreight, transShipmentPort, transitTime, vesselOrFlightDetails, freeTime, DOFee, validityTime, totalFreight } = req.body;

  const { userId, agentID } = req.user;

  if (!orderNumber || !validityTime || !netFreight) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Check if orderNumber already exists
    const checkOrder = await pool
    .request()
    .input("orderNumber", sql.VarChar, orderNumber)
    .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
  
    if (!checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Insert the new order into the database
    await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .input("AgentID", sql.Int, agentID)
      .input("netFreight", sql.Decimal, netFreight)
      .input("transShipmentPort", sql.VarChar, transShipmentPort)
      .input("transitTime", sql.Int, transitTime)
      .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
      .input("freeTime", sql.Int, freeTime)
      .input("DOFee", sql.Decimal, DOFee)
      .input("validityTime", sql.Int, validityTime)
      .input("totalFreight", sql.Decimal, totalFreight)
      .input("createdBy", sql.Int, userId)
      .query(addImportLCL);

    res.status(201).json({
      message: 'Quotation added successfully.'
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.' });
  }
});

router.post('/import-fcl', async (req, res) => {
  const { orderNumber, netFreight, DOFee, transShipmentPort, freeTime, carrier, transitTime, vesselOrFlightDetails, validityTime } = req.body;

  const { userId, agentID } = req.user;

  if (!orderNumber || !validityTime || !netFreight) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const pool = await poolPromise; // Get database connection

    // Check if orderNumber already exists
    const checkOrder = await pool
    .request()
    .input("orderNumber", sql.VarChar, orderNumber)
    .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
  
    if (!checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Insert the new order into the database
    await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .input("AgentID", sql.Int, agentID)
      .input("netFreight", sql.Decimal, netFreight)
      .input("DOFee", sql.Decimal, DOFee)
      .input("transShipmentPort", sql.VarChar, transShipmentPort)
      .input("freeTime", sql.Int, freeTime)
      .input("carrier", sql.VarChar, carrier)
      .input("transitTime", sql.Int, transitTime)
      .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
      .input("validityTime", sql.Int, validityTime)
      .input("createdBy", sql.Int, userId)
      .query(addImportFCL);

    res.status(201).json({
      message: 'Quotation added successfully.'
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.' });
  }
});

module.exports = router;
