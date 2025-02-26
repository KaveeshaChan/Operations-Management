const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { updateFreigtAgentStatus } = require('./queries/updateFreightAgentsQuery');
const { authorizeRoles } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.put("/status", authorizeRoles(['admin']), async (req, res) => {
    try {
        const { AgentID, AgentStatus } = req.body;

        if (!AgentID || !AgentStatus) {
            return res.status(400).json({ message: "AgentID and AgentStatus are required." });
        }
        const pool = await poolPromise;

        // Execute the query
        const result = await pool
            .request()
            .input("AgentID", sql.Int, AgentID)
            .input("AgentStatus", sql.VarChar, AgentStatus)
            .query(updateFreigtAgentStatus);

        res.status(200).json({ message: "Agent status updated successfully." });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Error updating agent status." });
    }
});

module.exports = router;