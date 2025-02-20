const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { addExportAirFreight, addExportLCL, addExportFCL } = require('./queries/quotationQueries/addNewExportQuotationQuery');
const { addImportAirFreight, addImportLCL, addImportFCL } = require('./queries/quotationQueries/addNewImportQuotationQuery');

const router = express.Router();

//export
router.post("/export-airFreight",async (req, res) => {
  try {
    const pool = await poolPromise;

    // Ensure req.body is an array
    const quotations = Array.isArray(req.body) ? req.body : [req.body];
    const { userId, agentID } = req.user;

    // Extract orderNumber from the first item in the array (all items should have the same orderNumber)
    const { orderNumber } = quotations[0];

    // Validate orderNumber
    if (!orderNumber) {
      return res.status(400).json({ message: "Order Number is required." });
    }

    // Check if orderNumber already exists
    const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT TOP 1 chargeableWeight, grossWeight FROM OrderDocs WHERE orderNumber = @orderNumber");

    let computedWeight;

    if (checkOrder.recordset.length > 0) {
      const { chargeableWeight, grossWeight } = checkOrder.recordset[0];

      // Use chargeableWeight if it's greater, otherwise use grossWeight
      computedWeight = chargeableWeight > grossWeight ? chargeableWeight : grossWeight;
    } else {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Process each quotation in the array
    for (const data of quotations) {
      const {
        netFreight, AWB, HAWB, airLine, transShipmentPort, transitTime, vesselOrFlightDetails, validityTime
      } = data;

      // Ensure required fields are provided
      if (!netFreight || !AWB || !HAWB || !airLine || !validityTime) {
        return res.status(400).json({ message: "All required fields must be provided." });
      }

      // Calculate totalFreight
      const totalFreight = computedWeight * parseFloat(netFreight);

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
        .input("validityTime", sql.DateTime, new Date(validityTime)) 
        .input("airLine", sql.VarChar, airLine)
        .input("AWB", sql.VarChar, AWB)
        .input("HAWB", sql.VarChar, HAWB)
        .input("createdBy", sql.Int, userId)
        .query(addExportAirFreight);
    }
    res.status(201).json({ message: "Quotation(s) added successfully." });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Failed to add quotation. Internal Server Error." });
  }
});

router.post('/export-lcl',async (req, res) => {
  try {
    const pool = await poolPromise; // Get database connection

    // Ensure req.body is an array
    const quotations = Array.isArray(req.body) ? req.body : [req.body];
    const { userId, agentID } = req.user;

    // Extract orderNumber from the first item in the array (all items should have the same orderNumber)
    const { orderNumber } = quotations[0];

    // Validate orderNumber
    if (!orderNumber) {
      return res.status(400).json({ message: "Order Number is required." });
    }

    // Check if orderNumber already exists
    const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT TOP 1 palletCBM FROM OrderDocs WHERE orderNumber = @orderNumber");
      
      let palletCBM;

      if (checkOrder.recordset.length > 0) {
        palletCBM = checkOrder.recordset[0].palletCBM;       ;
  
      } else {
        return res.status(400).json({ message: "There is no order with this order number." });
      }

      // Process each quotation in the array
      for (const data of quotations) {
        const { transShipmentPort, transitTime, vesselOrFlightDetails, validityTime, netFreight } = data;

        if (!validityTime || !netFreight) {
          return res.status(400).json({ message: 'All fields are required.' });
        }

      // Calculate totalFreight
      const totalFreight = palletCBM * parseFloat(netFreight);

        // Insert the new order into the database
        await pool
        .request()
        .input("orderNumber", sql.VarChar, orderNumber)
        .input("AgentID", sql.Int, agentID)
        .input("transShipmentPort", sql.VarChar, transShipmentPort)
        .input("transitTime", sql.Int, transitTime)
        .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
        .input("validityTime", sql.DateTime, new Date(validityTime))
        .input("netFreight", sql.Decimal, netFreight)
        .input("totalFreight", sql.Decimal, totalFreight)
        .input("createdBy", sql.Int, userId)
        .query(addExportLCL);
      }
      res.status(201).json({ message: "Quotation(s) added successfully." });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.' });
  }
});

router.post('/export-fcl',async (req, res) => {
  try {
    const pool = await poolPromise; // Get database connection

    // Ensure req.body is an array
    const quotations = Array.isArray(req.body) ? req.body : [req.body];
    const { userId, agentID } = req.user;

    // Extract orderNumber from the first item in the array (all items should have the same orderNumber)
    const { orderNumber } = quotations[0];

    // Validate orderNumber
    if (!orderNumber) {
      return res.status(400).json({ message: "Order Number is required." });
    }

    // Check if orderNumber already exists
    const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
      
    if (!checkOrder.recordset[0].count === 0) {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Process each quotation in the array
    for (const data of quotations) {
      const { netFreight, DTHC, freeTime, transShipmentPort, carrier, transitTime, vesselOrFlightDetails, validityTime } = data;

      if (!validityTime || !netFreight) {
        return res.status(400).json({ message: 'All fields are required.' });
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
        .input("validityTime", sql.DateTime, new Date(validityTime))
        .input("createdBy", sql.Int, userId)
        .query(addExportFCL);
    }
    res.status(201).json({ message: "Quotation(s) added successfully." });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.' });
  }
});

//import
router.post("/import-airFreight",async (req, res) => {
  try {
    const pool = await poolPromise;

    // Ensure req.body is an array
    const quotations = Array.isArray(req.body) ? req.body : [req.body];

    const { userId, agentID } = req.user;

    // Extract orderNumber from the first item in the array (all items should have the same orderNumber)
    const { orderNumber } = quotations[0];

    // Validate orderNumber
    if (!orderNumber) {
      return res.status(400).json({ message: "Order Number is required." });
    }

    // Check if orderNumber exists **once** before processing the array
    const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT TOP 1 chargeableWeight, grossWeight FROM OrderDocs WHERE orderNumber = @orderNumber");

    let computedWeight;

    if (checkOrder.recordset.length > 0) {
      const { chargeableWeight, grossWeight } = checkOrder.recordset[0];

      // Use chargeableWeight if it's greater, otherwise use grossWeight
      computedWeight = chargeableWeight > grossWeight ? chargeableWeight : grossWeight;
    } else {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Process each quotation in the array
    for (const data of quotations) {
      const { airFreightCost, AWB, carrier, transitTime, vesselOrFlightDetails, validityTime } = data;

      // Validate required fields
      if (!carrier || !AWB) {
        return res.status(400).json({ message: "All required fields must be provided." });
      }

      // Calculate totalFreight
      const totalFreight = computedWeight * parseFloat(airFreightCost);

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
        .input("validityTime", sql.DateTime, new Date(validityTime))
        .input("totalFreight", sql.Decimal, totalFreight)
        .input("createdBy", sql.Int, userId)
        .query(addImportAirFreight);
    }

    res.status(201).json({ message: "Quotation(s) added successfully." });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Failed to add quotation. Internal Server Error.", error: err.message });
  }
});

router.post('/import-lcl',async (req, res) => {
  try {
    const pool = await poolPromise; // Get database connection

    // Ensure req.body is an array
    const quotations = Array.isArray(req.body) ? req.body : [req.body];
    const { userId, agentID } = req.user;

    // Extract orderNumber from the first item in the array (all items should have the same orderNumber)
    const { orderNumber } = quotations[0];

    // Validate orderNumber
    if (!orderNumber) {
      return res.status(400).json({ message: "Order Number is required." });
    }

    // Check if orderNumber already exists
    const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT TOP 1 palletCBM FROM OrderDocs WHERE orderNumber = @orderNumber");

      let palletCBM;

      if (checkOrder.recordset.length > 0) {
        palletCBM = checkOrder.recordset[0].palletCBM;       ;
  
      } else {
        return res.status(400).json({ message: "There is no order with this order number." });
      }

    // Process each quotation in the array
    for (const data of quotations) {
      const { netFreight, transShipmentPort, transitTime, vesselOrFlightDetails, freeTime, DOFee, validityTime } = data;

      if (!orderNumber || !validityTime || !netFreight) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Calculate totalFreight
      const totalFreight = palletCBM * parseFloat(netFreight);

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
        .input("validityTime", sql.DateTime, new Date(validityTime))
        .input("totalFreight", sql.Decimal, totalFreight)
        .input("createdBy", sql.Int, userId)
        .query(addImportLCL);
    }
    res.status(201).json({ message: "Quotation(s) added successfully." });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.' });
  }
});

router.post('/import-fcl',async (req, res) => {
  try {
    const pool = await poolPromise; // Get database connection

    // Ensure req.body is an array
    const quotations = Array.isArray(req.body) ? req.body : [req.body];
    const { userId, agentID } = req.user;

    // Extract orderNumber from the first item in the array (all items should have the same orderNumber)
    const { orderNumber } = quotations[0];

    // Validate orderNumber
    if (!orderNumber) {
      return res.status(400).json({ message: "Order Number is required." });
    }

    // Check if orderNumber already exists
    const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");

    if (checkOrder.recordset[0].count === 0) {
      return res.status(400).json({ message: "There is no order with this order number." });
    }

    // Process each quotation in the array
    for (const data of quotations) {
      const {netFreight, DOFee, transShipmentPort, freeTime, carrier, transitTime, vesselOrFlightDetails, validityTime} = data;

      if (!orderNumber || !validityTime || !netFreight) {
        return res.status(400).json({ message: 'All fields are required.' });
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
        .input("validityTime", sql.DateTime, new Date(validityTime))
        .input("createdBy", sql.Int, userId)
        .query(addImportFCL);
    }
    res.status(201).json({ message: "Quotation(s) added successfully." });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.', error: err.message });
  }
});

module.exports = router;
