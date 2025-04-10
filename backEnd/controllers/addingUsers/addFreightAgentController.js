const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const bcrypt = require('bcryptjs');
const { getAllFromFreightAgent, freightAgentRegistration } = require('../../auth/queries/freightAgentRegisterQuery');
const { generateNewFreightAgentEmail } = require('../emailHandlingControllers/utils/emailTemps');

const router = express.Router();

// Register Route
router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const { name, BRN, address, contactNumber, email, director1ContactNumber, director1Email, director1Name, director2ContactNumber, director2Email, director2Name, password, country, userID} = req.body;

  if (!email || !password || !BRN || !name || !country || !address || !contactNumber || !director1Name || !director1ContactNumber || !director1Email) {
    return res.status(400).json({ error: 'Inputs are required.' });
  }

  const pool = await poolPromise; // Await the resolved poolPromise

  try {
    // Start a SQL transaction
    const transaction = pool.transaction();
    await transaction.begin();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email already exists
    const existingUser = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query(getAllFromFreightAgent);

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Insert user into the database
    await transaction
      .request()
      .input('Freight_Agent', sql.VarChar, name)
      .input('BRNumber', sql.VarChar, BRN)
      .input('Country', sql.VarChar, country)
      .input('Address', sql.VarChar, address)
      .input('ContactNumber', sql.VarChar, contactNumber)
      .input('Email', sql.VarChar, email)
      .input('Director1_Name', sql.VarChar, director1Name)
      .input('Director1_Contact_Number', sql.VarChar, director1ContactNumber)
      .input('Director1_Email', sql.VarChar, director1Email)
      .input('Director2_Name', sql.VarChar, director2Name)
      .input('Director2_Contact_Number', sql.VarChar, director2ContactNumber)
      .input('Director2_Email', sql.VarChar, director2Email)
      .input('PasswordHash', sql.VarChar, hashedPassword)
      .input('AgentStatus', sql.VarChar, 'Active')
      .input('CreatedBy', sql.Int, userID)
      .query(freightAgentRegistration);

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
    const emailResponse = await fetch('http://192.168.100.20:5056/api/send-email/', {
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

    res.status(201).json({ message: 'Freight agent added and email sent successfully.' });
  } catch (err) {
    console.error('Error:', err.message);

    if (err.message === "Failed to send email notification") {
        await transaction.rollback();
    }

    res.status(500).json({ message: 'Failed to add freight agent or send email. ' + err.message });
}
});

module.exports = router;
