const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { selectMainUsers } = require('./queries/viewUsersQuery');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;

        // Execute the query
        const result = await pool
            .request()
            .query(selectMainUsers);

        res.status(200).json({ mainUsers: result.recordset });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Failed to fetch main users. Internal Server Error." });
    }
});

module.exports = router;