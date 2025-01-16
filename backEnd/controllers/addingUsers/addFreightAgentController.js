const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const bcrypt = require('bcryptjs');
const { getAllFromFreightAgent, freightAgentRegistration } = require('../../auth/queries/freightAgentRegisterQuery');

const router = express.Router();

// Register Route
router.post('/', async (req, res) => {
  const { name, BRN, address, contactNumber, email, director1ContactNumber, director1Email, director1Name, director2ContactNumber, director2Email, director2Name, password, country} = req.body;
  console.log(name, BRN, address, contactNumber, email, director1ContactNumber, director1Email, director1Name, director2ContactNumber, director2Email, director2Name, password, country);

  if (!email || !password || !BRN || !name || !country || !address || !contactNumber || !director1Name || !director1ContactNumber || !director1Email) {
    return res.status(400).json({ error: 'Inputs are required.' });
  }

  try {
    const pool = await poolPromise; // Await the resolved poolPromise
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
    await pool
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
      .query(freightAgentRegistration);

    res.status(201).json({ message: 'Freight Agent registered successfully.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

module.exports = router;
