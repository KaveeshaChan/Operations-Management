const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const {updateExportAirFreight, updateExportFCL,  updateExportLCL} = require('./queries/quotationQueries/updateExportQuotation')
const {updateImportAirFreight, updateImportFCL,  updateImportLCL} = require('./queries/quotationQueries/updateImportQuotation')

const router = express.Router();

//export
router.post('/export-air',async (req, res) => {

    try {       
      const pool = await poolPromise; // Get database connection
  
      // Ensure req.body is an array
      const quotations = Array.isArray(req.body) ? req.body : [req.body];
      const { userId, agentID } = req.user;
  
    // Extract orderNumber from the first item in the array
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
         const { OrderQuoteID, netFreight, AWB, HAWB, airLine, transShipmentPort, transitTime, vesselOrFlightDetails, validityTime } = data;
      
         // Insert the updated quotation into the database
         await pool
           .request()
           .input("OrderQuoteID", sql.Int, OrderQuoteID)
           .input("AgentID", sql.Int, agentID)
           .input("netFreight", sql.Decimal, netFreight)
           .input("AWB", sql.Decimal, AWB)
           .input("HAWB", sql.Int, HAWB)
           .input("airLine", sql.VarChar, airLine)
           .input("transShipmentPort", sql.VarChar, transShipmentPort)
           .input("transitTime", sql.Int, transitTime)
           .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
           .input("validityTime", sql.DateTime, new Date(validityTime))
           .input("createdBy", sql.Int, userId)
           .query(updateExportAirFreight);
       }
       res.status(201).json({ message: "Quotation updated successfully." });
    } catch (err) {
       console.error('Error:', err.message);
       res.status(500).json({ message: 'Failed to update quotation. Internal Server Error.' });
    }
});

router.post('/export-fcl',async (req, res) => {

    try {       
      const pool = await poolPromise; // Get database connection
  
      // Ensure req.body is an array
      const quotations = Array.isArray(req.body) ? req.body : [req.body];
      const { userId, agentID } = req.user;
  
    // Extract orderNumber from the first item in the array
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
         const { OrderQuoteID, netFreight, DTHC, freeTime, transShipmentPort, carrier, transitTime, vesselOrFlightDetails, validityTime } = data;
      
         // Insert the updated quotation into the database
         await pool
           .request()
           .input("OrderQuoteID", sql.Int, OrderQuoteID)
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
           .query(updateExportFCL);
       }
       res.status(201).json({ message: "Quotation updated successfully." });
    } catch (err) {
       console.error('Error:', err.message);
       res.status(500).json({ message: 'Failed to update quotation. Internal Server Error.' });
    }
});

router.post('/export-lcl',async (req, res) => {

    try {       
      const pool = await poolPromise; // Get database connection
  
      // Ensure req.body is an array
      const quotations = Array.isArray(req.body) ? req.body : [req.body];
      const { userId, agentID } = req.user;
  
    // Extract orderNumber from the first item in the array
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
         const { OrderQuoteID, netFreight, transShipmentPort, transitTime, vesselOrFlightDetails, validityTime } = data;

         //caculate totalFreight
         const totalFreight = palletCBM * parseFloat(netFreight);
      
         // Insert the updated quotation into the database
         await pool
           .request()
           .input("OrderQuoteID", sql.Int, OrderQuoteID)
           .input("AgentID", sql.Int, agentID)
           .input("netFreight", sql.Decimal, netFreight)
           .input("totalFreight", sql.Decimal, totalFreight)
           .input("transShipmentPort", sql.VarChar, transShipmentPort)
           .input("transitTime", sql.Int, transitTime)
           .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
           .input("validityTime", sql.DateTime, new Date(validityTime))
           .input("createdBy", sql.Int, userId)
           .query(updateExportLCL);
       }
       res.status(201).json({ message: "Quotation updated successfully." });
    } catch (err) {
       console.error('Error:', err.message);
       res.status(500).json({ message: 'Failed to update quotation. Internal Server Error.' });
    }
});


//import
router.post('/import-air',async (req, res) => {

    try {       
      const pool = await poolPromise; // Get database connection
  
      // Ensure req.body is an array
      const quotations = Array.isArray(req.body) ? req.body : [req.body];
      const { userId, agentID } = req.user;
  
    // Extract orderNumber from the first item in the array
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
         const { OrderQuoteID, airFreightCost, carrier, AWB, transitTime, vesselOrFlightDetails, validityTime } = data;

         // Calculate totalFreight
         const totalFreight = computedWeight * parseFloat(airFreightCost);
      
         // Insert the updated quotation into the database
         await pool
           .request()
           .input("OrderQuoteID", sql.Int, OrderQuoteID)
           .input("AgentID", sql.Int, agentID)
           .input("airFreightCost", sql.Decimal, airFreightCost)
           .input("AWB", sql.Decimal, AWB)
           .input("carrier", sql.VarChar, carrier)
           .input("transitTime", sql.Int, transitTime)
           .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
           .input("validityTime", sql.DateTime, new Date(validityTime))
           .input("createdBy", sql.Int, userId)
           .query(updateImportAirFreight);
       }
       res.status(201).json({ message: "Quotation updated successfully." });
    } catch (err) {
       console.error('Error:', err.message);
       res.status(500).json({ message: 'Failed to update quotation. Internal Server Error.' });
    }
});

router.post('/import-lcl',async (req, res) => {

    try {       
      const pool = await poolPromise; // Get database connection
  
      // Ensure req.body is an array
      const quotations = Array.isArray(req.body) ? req.body : [req.body];
      const { userId, agentID } = req.user;
  
    // Extract orderNumber from the first item in the array
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
            palletCBM = checkOrder.recordset[0].palletCBM;
      
          } else {
            return res.status(400).json({ message: "There is no order with this order number." });
          }
  
       // Process each quotation in the array
       for (const data of quotations) {
         const { OrderQuoteID, netFreight, transShipmentPort, transitTime, vesselOrFlightDetails, freeTime, DOFee, validityTime } = data;

         //caculate totalFreight
         const totalFreight = palletCBM * parseFloat(netFreight);
      
         // Insert the updated quotation into the database
         await pool
           .request()
           .input("OrderQuoteID", sql.Int, OrderQuoteID)
           .input("AgentID", sql.Int, agentID)
           .input("netFreight", sql.Decimal, netFreight)
           .input("totalFreight", sql.Decimal, totalFreight)
           .input("transShipmentPort", sql.VarChar, transShipmentPort)
           .input("transitTime", sql.Int, transitTime)
           .input("freeTime", sql.Int, freeTime)
           .input("DOFee", sql.Decimal, DOFee)
           .input("vesselOrFlightDetails", sql.VarChar, vesselOrFlightDetails)
           .input("validityTime", sql.DateTime, new Date(validityTime))
           .input("createdBy", sql.Int, userId)
           .query(updateImportLCL);
       }
       res.status(201).json({ message: "Quotation updated successfully." });
    } catch (err) {
       console.error('Error:', err.message);
       res.status(500).json({ message: 'Failed to update quotation. Internal Server Error.' });
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
        const {OrderQuoteID, netFreight, DOFee, transShipmentPort, freeTime, carrier, transitTime, vesselOrFlightDetails, validityTime} = data;  
  
        // Insert the new order into the database
        await pool
          .request()
          .input("OrderQuoteID", sql.Int, OrderQuoteID)
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
          .query(updateImportFCL);
      }
      res.status(201).json({ message: "Quotation(s) added successfully." });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ message: 'Failed to add quotation. Internal Server Error.', error: err.message });
    }
  });

module.exports = router;