const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { selectAllFreightAgents, selectFreightCoordinators } = require('./queries/viewUsersQuery');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;

        // Execute the query
        const result = await pool
            .request()
            .query(selectAllFreightAgents);

        res.status(200).json({ freightAgents: result.recordset });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Failed to fetch freight agents. Internal Server Error." });
    }
});

module.exports = router;