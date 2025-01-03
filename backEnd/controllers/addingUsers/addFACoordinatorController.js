const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const bcrypt = require('bcryptjs');
const { getFreightAgentsList, getAllFromFACoordinators, FACoordinatorRegistration } = require('../../auth/queries/faCoordinatorRegisterQuery');
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
  const { name, contactNumber, email, freightAgent, password} = req.body;

  if (!email || !password || !name || !freightAgent || !contactNumber) {
    return res.status(400).json({ error: 'Inputs are required.' });
  }

  try {
    const pool = await poolPromise; // Await the resolved poolPromise
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
    await pool
      .request()
      .input('Coordinator_Name', sql.VarChar, name)
      .input('ContactNumber', sql.VarChar, contactNumber)
      .input('Email', sql.VarChar, email)
      .input('Freight_Agent', sql.VarChar, freightAgent)
      .input('PasswordHash', sql.VarChar, hashedPassword)
      .query(FACoordinatorRegistration);

    res.status(200).json({ message: 'Freight Agent Coordinator registered successfully.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

module.exports = router;
