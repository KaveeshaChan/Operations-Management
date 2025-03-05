const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const bcrypt = require('bcryptjs');
const { getFreightAgentsList, getAllFromFACoordinators, FACoordinatorRegistration } = require('../../auth/queries/faCoordinatorRegisterQuery');
const { generateNewFreightAgentEmail } = require('../emailHandlingControllers/utils/emailTemps');
const router = express.Router();

// freig9543ht agents list
router.get('/freight-agents-list', async (req, res) => {
    try {
        const pool = await poolPromise;

        const freightAgentsList = await pool
        .request()
        .query(getFreightAgentsList);

        if (freightAgentsList.length > 0) {
            return res.status(200).json({ error: 'The Freight Agent List is empty.' });
        }
        res.status(200).json({  freightAgentsList: freightAgentsList.recordset });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error.' });
      }
})

// Register Route
router.post('/add-freight-coordinator', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const { name, contactNumber, email, freightAgent, password, userID} = req.body;

  if (!email || !password || !name || !freightAgent || !contactNumber) {
    return res.status(400).json({ error: 'Inputs are required.' });
  }

  const pool = await poolPromise;

  try {
    // Start a SQL transaction
    const transaction = pool.transaction();
    await transaction.begin();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email already exists
    const existingUser = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query(getAllFromFACoordinators);

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Insert user into the database
    await transaction
      .request()
      .input('Coordinator_Name', sql.VarChar, name)
      .input('ContactNumber', sql.VarChar, contactNumber)
      .input('Email', sql.VarChar, email)
      .input('Freight_Agent', sql.VarChar, freightAgent)
      .input('PasswordHash', sql.VarChar, hashedPassword)
      .input('CreatedBy', sql.Int, userID)
      .query(FACoordinatorRegistration);
    
    // Prepare email payload
    const emailPayload = {
      // to: email,
      to: "thirimadurasandun@gmail.com",
      subject: `Welcome to Cargo Connect by Basilur Tea Exports (Pvt) Ltd - Your Freight Agent Account Details`,
      html: generateNewFreightAgentEmail({
        name,
        email,
        password
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

    res.status(200).json({ message: 'Freight Agent Coordinator registered successfully.' });
  } catch (err) {
    console.error('Error:', err.message);

    if (err.message === "Failed to send email notification") {
        await transaction.rollback();
    }

    res.status(500).json({ message: 'Failed to add order or send email. ' + err.message });
}
});

module.exports = router;
