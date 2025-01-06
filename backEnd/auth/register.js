const express = require('express');
const { sql, poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');
const { getAllFromUsers, userRegistration } = require('./queries/freightAgentRegisterQuery');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { User_Contact_Number, email, password, Freight_Agent, roleName } = req.body;
  console.log(req.body);

  if (!email || !password || !roleName) {
    return res.status(400).json({ error: 'Email, password, and role name are required.' });
  }

  try {
    const pool = await poolPromise; // Await the resolved poolPromise
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email already exists
    const existingUser = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query(getAllFromUsers);

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Insert user into the database
    await pool
      .request()
      .input('User_Contact_Number', sql.VarChar, User_Contact_Number)
      .input('email', sql.VarChar, email)
      .input('hashedPassword', sql.VarChar, hashedPassword)
      .input('Freight_Agent', sql.VarChar, Freight_Agent)
      .input('roleName', sql.VarChar, roleName)
      .query(userRegistration);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

module.exports = router;


// const express = require('express');
// const bcrypt = require('bcryptjs');
// const { createClient } = require('@supabase/supabase-js');

// const router = express.Router();

// // Initialize Supabase client
// const supabaseUrl = 'https://fmkilgskkqttyptjyajv.supabase.co'; 
// const supabaseKey = 'your-supabase-key';       
// const supabase = createClient(supabaseUrl, supabaseKey);

// // Register Route
// router.post('/register', async (req, res) => {
//   const { User_Contact_Number, email, password, Freight_Agent, roleName } = req.body;
//   console.log(req.body);

//   if (!email || !password || !roleName) {
//     return res.status(400).json({ error: 'Email, password, and role name are required.' });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Check if the email already exists
//     const { data: existingUser, error: fetchError } = await supabase
//       .from('Users')
//       .select('*')
//       .eq('Email', email);

//     if (fetchError) {
//       console.error('Error fetching user:', fetchError.message);
//       return res.status(500).json({ error: 'Error checking existing user.' });
//     }

//     if (existingUser && existingUser.length > 0) {
//       return res.status(409).json({ error: 'Email already in use.' });
//     }

//     // Fetch AgentID and RoleID
//     const { data: agentData, error: agentError } = await supabase
//       .from('Freight_Agents')
//       .select('AgentID')
//       .eq('Freight_Agent', Freight_Agent)
//       .single();

//     if (agentError || !agentData) {
//       return res.status(404).json({ error: 'Freight Agent not found.' });
//     }

//     const { data: roleData, error: roleError } = await supabase
//       .from('Roles')
//       .select('RoleID')
//       .eq('RoleName', roleName)
//       .single();

//     if (roleError || !roleData) {
//       return res.status(404).json({ error: 'Role not found.' });
//     }

//     // Insert the new user
//     const { error: insertError } = await supabase
//       .from('Users')
//       .insert([
//         {
//           User_Contact_Number,
//           Email: email,
//           PasswordHash: hashedPassword,
//           AgentID: agentData.AgentID,
//           RoleID: roleData.RoleID,
//         },
//       ]);

//     if (insertError) {
//       console.error('Error inserting user:', insertError.message);
//       return res.status(500).json({ error: 'Error registering user.' });
//     }

//     res.status(201).json({ message: 'User registered successfully.' });
//   } catch (err) {
//     console.error('Error:', err.message);
//     res.status(500).json({ error: 'Internal Server Error.' });
//   }
// });

// module.exports = router;

