const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { generateFreightRequestEmail } = require('../emailHandlingControllers/utils/emailTemps');
const { addExportAirFreight, addExportLCL, addExportFCL } = require('./queries/addNewOrderQueries/addNewOrderExportQueries');
const { addImportAirFreight, addImportLCL, addImportFCL } = require('./queries/addNewOrderQueries/addNewOrderImportQueries');

const router = express.Router();

//export
router.post("/export-airFreight", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }
  
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

    const pool = await poolPromise;

    // Check if orderNumber already exists
    const checkOrder = await pool
        .request()
        .input("orderNumber", sql.VarChar, orderNumber)
        .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");
  
    if (checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "Order with this Order Number already exists." });
    }

    // Convert fileUpload (Base64 string from frontend) back to Buffer
    const buffer = fileUpload ? Buffer.from(fileUpload, "base64") : null;

    try {
      // Start a SQL transaction
      const transaction = pool.transaction();
      await transaction.begin();

      const agentEmailsResult = await fetch('http://localhost:5056/api/select/view-freight-agents/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      })
  
      if (!agentEmailsResult.ok) {
        throw new Error('Failed to fetch agent emails');
      }
  
      const agentEmailsData = await agentEmailsResult.json();
      const activeAgentEmails = agentEmailsData.agents.map(agent => agent.Email).join(",");
      const activeEmailCount = agentEmailsData.agents.length;

    // Insert into the database inside the transaction
    await transaction
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
      .input("emailCount", sql.Int, activeEmailCount)
      .query(addExportAirFreight);

    // Prepare email payload
    const emailPayload = {
      // to: activeAgentEmails,
      to: "thirimadurasandun@gmail.com",
      subject: `Freight Request - Basilur Tea Exports (Pvt) Ltd - Order Number(${orderNumber})`,
      html: generateFreightRequestEmail({
        orderNumber,
        routeFrom,
        routeTo,
        shipmentType,
        shipmentReadyDate,
        targetDate
    }),
    };

    // Send email
    const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
          body: JSON.stringify(emailPayload)
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email notification");
      }

      // Commit transaction if everything succeeded
      await transaction.commit();

      res.status(201).json({ message: 'Order added and email sent successfully.' });
  } catch (err) {
    console.error("Error:", err.message);

    if (err.message === "Failed to send email notification") {
      await transaction.rollback();
    }
    res.status(500).json({ message: 'Failed to add order or send email. ' + err.message });
  }
});

router.post('/export-lcl', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, 
    numberOfPallets, palletCBM, cargoCBM, grossWeight, targetDate, additionalNotes, fileUpload, fileName, userId, dueDate } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !numberOfPallets || !palletCBM || !grossWeight || !cargoCBM || !targetDate || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

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
    const buffer = fileUpload ? Buffer.from(fileUpload, "base64") : null;

    try {
      // Start a SQL transaction
      const transaction = pool.transaction();
      await transaction.begin();

      const agentEmailsResult = await fetch('http://localhost:5056/api/select/view-freight-agents/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      })

      if (!agentEmailsResult.ok) {
        throw new Error('Failed to fetch agent emails');
      }

      const agentEmailsData = await agentEmailsResult.json();
      const activeAgentEmails = agentEmailsData.agents.map(agent => agent.Email).join(",");
      const activeEmailCount = agentEmailsData.agents.length; 

    // Insert the new order into the database
    await transaction
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
      .input("emailCount", sql.Int, activeEmailCount)
      .query(addExportLCL);

    // Prepare email payload
    const emailPayload = {
      // to: activeAgentEmails,
      to: "thirimadurasandun@gmail.com",
      subject: `Freight Request - Basilur Tea Exports (Pvt) Ltd - Order Number(${orderNumber})`,
      html: generateFreightRequestEmail({
        orderNumber,
        routeFrom,
        routeTo,
        shipmentType,
        shipmentReadyDate,
        targetDate
    }),
    };

      // Send email
      const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(emailPayload)
        });

        if (!emailResponse.ok) {
          throw new Error("Failed to send email notification");
        }

        // Commit transaction if everything succeeded
        await transaction.commit();

        res.status(201).json({ message: 'Order added and email sent successfully.' });
  } catch (err) {
    console.error("Error:", err.message);

    if (err.message === "Failed to send email notification") {
      await transaction.rollback();
    }
    res.status(500).json({ message: 'Failed to add order or send email. ' + err.message });
  }
});

router.post('/export-fcl', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const {
      orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate,
      deliveryTerm, type, numberOfContainers, targetDate, fileUpload,
      fileName, additionalNotes, userId, dueDate
  } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || 
      !shipmentReadyDate || !deliveryTerm || !type || !numberOfContainers || !targetDate || !userId) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  const pool = await poolPromise;

  // Check if orderNumber already exists
  const checkOrder = await pool
      .request()
      .input("orderNumber", sql.VarChar, orderNumber)
      .query("SELECT COUNT(*) AS count FROM OrderDocs WHERE orderNumber = @orderNumber");

  if (checkOrder.recordset[0].count > 0) {
      return res.status(400).json({ message: "Order with this Order Number already exists." });
  }

  const buffer = fileUpload ? Buffer.from(fileUpload, "base64") : null;

  try {
      // Start a SQL transaction
      const transaction = pool.transaction();
      await transaction.begin();

      const agentEmailsResult = await fetch('http://localhost:5056/api/select/view-freight-agents/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      })

      if (!agentEmailsResult.ok) {
        throw new Error('Failed to fetch agent emails');
      }

      const agentEmailsData = await agentEmailsResult.json();
      const activeAgentEmails = agentEmailsData.agents.map(agent => agent.Email).join(",");
      const activeEmailCount = agentEmailsData.agents.length; 

      // Insert the order inside the transaction
      await transaction
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
          .input("documentData", sql.VarBinary, buffer)
          .input("documentName", sql.VarChar, fileName || null)
          .input("createdBy", sql.VarChar, userId)
          .input("dueDate", sql.Int, dueDate)
          .input("emailCount", sql.Int, activeEmailCount)
          .query(addExportFCL);
      
    // Prepare email payload
    const emailPayload = {
      // to: activeAgentEmails,
      to: "thirimadurasandun@gmail.com",
      subject: `Freight Request - Basilur Tea Exports (Pvt) Ltd - Order Number(${orderNumber})`,
      html: generateFreightRequestEmail({
        orderNumber,
        routeFrom,
        routeTo,
        shipmentType,
        shipmentReadyDate,
        targetDate
    }),
    };

      // Send email (this could call your existing email API)
      const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

    if (!emailResponse.ok) {
        throw new Error("Failed to send email notification");
    }

      // Commit transaction if everything succeeded
      await transaction.commit();

      res.status(201).json({ message: 'Order added and email sent successfully.' });

  } catch (err) {
      console.error('Error:', err.message);

      if (err.message === "Failed to send email notification") {
          await transaction.rollback();
      }

      res.status(500).json({ message: 'Failed to add order or send email. ' + err.message });
  }
});

//import
router.post('/import-airFreight', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, cargoType, 
    numberOfPallets, chargeableWeight, grossWeight, cargoCBM, LWHWithThePallet, productDescription, targetDate, additionalNotes,
    fileUpload, fileName, userId, dueDate } = req.body;


  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !cargoType || !chargeableWeight || !grossWeight || 
    !cargoCBM || !targetDate || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

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
        const buffer = fileUpload ? Buffer.from(fileUpload, "base64") : null;

        try {
          // Start a SQL transaction
          const transaction = pool.transaction();
          await transaction.begin();

          const agentEmailsResult = await fetch('http://localhost:5056/api/select/view-freight-agents/emails', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
          })
    
          if (!agentEmailsResult.ok) {
            throw new Error('Failed to fetch agent emails');
          }
    
          const agentEmailsData = await agentEmailsResult.json();
          const activeAgentEmails = agentEmailsData.agents.map(agent => agent.Email).join(",");
          const activeEmailCount = agentEmailsData.agents.length; 

    // Insert the new order into the database
    await transaction
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
      .input("emailCount", sql.Int, activeEmailCount)
      .query(addImportAirFreight);

    // Prepare email payload
    const emailPayload = {
      // to: activeAgentEmails,
      to: "thirimadurasandun@gmail.com",
      subject: `Freight Request - Basilur Tea Exports (Pvt) Ltd - Order Number(${orderNumber})`,
      html: generateFreightRequestEmail({
        orderNumber,
        routeFrom,
        routeTo,
        shipmentType,
        shipmentReadyDate,
        targetDate
    }),
    };

      // Send email (this could call your existing email API)
      const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
          },
            body: JSON.stringify(emailPayload)
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email notification");
    }

    // Commit transaction if everything succeeded
    await transaction.commit();

    res.status(201).json({ message: 'Order added and email sent successfully.' });

  } catch (err) {
      console.error('Error:', err.message);

      if (err.message === "Failed to send email notification") {
          await transaction.rollback();
      }

      res.status(500).json({ message: 'Failed to add order or send email. ' + err.message });
  }
});

router.post('/import-lcl', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, 
    numberOfPallets, palletCBM, cargoCBM, grossWeight, targetDate, productDescription, additionalNotes, fileUpload, fileName, userId, dueDate } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !numberOfPallets || !palletCBM || !grossWeight || !cargoCBM || !targetDate || !userId) {
    return res.status(400).json({ message: 'All fields are required. bck' });
  }

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
  const buffer = fileUpload ? Buffer.from(fileUpload, "base64") : null;

  try {
    // Start a SQL transaction
    const transaction = pool.transaction();
    await transaction.begin(); 

    const agentEmailsResult = await fetch('http://localhost:5056/api/select/view-freight-agents/emails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    })

    if (!agentEmailsResult.ok) {
      throw new Error('Failed to fetch agent emails');
    }

    const agentEmailsData = await agentEmailsResult.json();
    const activeAgentEmails = agentEmailsData.agents.map(agent => agent.Email).join(",");
    const activeEmailCount = agentEmailsData.agents.length; 

  // Insert the new order into the database
  await transaction
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
    .input("emailCount", sql.Int, activeEmailCount)
    .query(addImportLCL);

    // Prepare email payload
    const emailPayload = {
      // to: activeAgentEmails,
      to: "thirimadurasandun@gmail.com",
      subject: `Freight Request - Basilur Tea Exports (Pvt) Ltd - Order Number(${orderNumber})`,
      html: generateFreightRequestEmail({
        orderNumber,
        routeFrom,
        routeTo,
        shipmentType,
        shipmentReadyDate,
        targetDate
    }),
    };

    // Send email (this could call your existing email API)
    const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send email notification");
    }

    // Commit transaction if everything succeeded
    await transaction.commit();

    res.status(201).json({ message: 'Order added and email sent successfully.' });
  } catch (err) {
    console.error('Error:', err.message);

    if (err.message === "Failed to send email notification") {
        await transaction.rollback();
    }

    res.status(500).json({ message: 'Failed to add order or send email. ' + err.message });
  }
});

router.post('/import-fcl', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const { orderType, shipmentType, orderNumber, routeFrom, routeTo, shipmentReadyDate, deliveryTerm, type, 
    targetDate, numberOfContainers, productDescription, additionalNotes, fileUpload, fileName, userId, dueDate } = req.body;

  if (!orderType || !shipmentType || !orderNumber || !routeFrom || !routeTo || !shipmentReadyDate || 
    !deliveryTerm || !type || !numberOfContainers || !targetDate || !userId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

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
  const buffer = fileUpload ? Buffer.from(fileUpload, "base64") : null;

  try {
    // Start a SQL transaction
    const transaction = pool.transaction();
    await transaction.begin(); 

    const agentEmailsResult = await fetch('http://localhost:5056/api/select/view-freight-agents/emails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    })

    if (!agentEmailsResult.ok) {
      throw new Error('Failed to fetch agent emails');
    }

    const agentEmailsData = await agentEmailsResult.json();
    const activeAgentEmails = agentEmailsData.agents.map(agent => agent.Email).join(",");
    const activeEmailCount = agentEmailsData.agents.length; 

    // Insert the new order into the database
    await transaction
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
      .input("emailCount", sql.Int, activeEmailCount)
      .query(addImportFCL);

    // Prepare email payload
    const emailPayload = {
      // to: activeAgentEmails,
      to: "thirimadurasandun@gmail.com",
      subject: `Freight Request - Basilur Tea Exports (Pvt) Ltd - Order Number(${orderNumber})`,
      html: generateFreightRequestEmail({
        orderNumber,
        routeFrom,
        routeTo,
        shipmentType,
        shipmentReadyDate,
        targetDate
    }),
    };

    // Send email (this could call your existing email API)
    const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send email notification");
    }

    // Commit transaction if everything succeeded
    await transaction.commit();

    res.status(201).json({ message: 'Order added and email sent successfully.' });

  } catch (err) {
      console.error('Error:', err.message);

      if (err.message === "Failed to send email notification") {
          await transaction.rollback();
      }

      res.status(500).json({ message: 'Failed to add order or send email. ' + err.message });
  }
});

module.exports = router;
