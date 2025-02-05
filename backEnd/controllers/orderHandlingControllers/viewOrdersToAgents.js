const express = require('express');
const { sql, poolPromise } = require('../../config/database');


const router = express.Router();

router.post("/view-orders", async (req, res) => {
    const { userID, AgentID } = req.body;
    if (!userID || !AgentID){
        return res.status(400).json({ message: "User ID or Agent ID not provided." });
    }

    try{
        const pool = await poolPromise;

        // Check if user is under an Active agent
        const checkUser = await pool
        .request()
        .input("AgentID", sql.Int, AgentID)
        .query("SELECT COUNT(*) AS IsActive FROM Freight_Agents WHERE AgentID = @AgentID AND AgentStatus = 'Active';");

        const isActive = checkUser.recordset[0].IsActive > 0;

        if (!isActive) {
            return res.status(403).json({ message: "Agent is not active." });
        }
    } catch {

    }
})

module.exports = router;