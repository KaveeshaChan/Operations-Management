const express = require('express');
const { sql, poolPromise } = require('../../config/database');
const { selectAllFreightAgents, selectFreightCoordinators, freightShipments } = require('./queries/viewUsersQuery');
const { authorizeRoles } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get("/", authorizeRoles(['admin','mainUser']), async (req, res) => {
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

router.get("/coordinators/:agentID", async (req, res) => {
  try {
      const { agentID } = req.params;

      if (!agentID) {
        return res.status(400).json({ message: "Agent ID is required." });
      }

      const pool = await poolPromise;

      // Execute the query
      const result = await pool
          .request()
          .input("AgentID", sql.Int, agentID)
          .query(selectFreightCoordinators);

      res.status(200).json({ freightCoordinators: result.recordset });
  } catch (err) {
      console.error("Error:", err.message);
      res.status(500).json({ message: "Failed to fetch freight coordinators. Internal Server Error." });
  }
});

router.get("/emails", async (req, res) => {
    try {
        const pool = await poolPromise;

        // Execute the query
        const result = await pool
            .request()
            .query("SELECT [AgentID], [Email], [AgentStatus] FROM [FreightAgentAlloc_App].[dbo].[Freight_Agents] WHERE AgentID != -99 AND AgentStatus = 'Active'");

        res.status(200).json({ agents: result.recordset });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Failed to fetch agent emails. Internal Server Error." });
    }
});

router.get("/active-agents", authorizeRoles(['admin','mainUser']), async (req, res) => {
    try {
        const pool = await poolPromise;

        // Execute the query
        const result = await pool
            .request()
            .query(`SELECT 
                        COUNT(CASE WHEN AgentStatus = 'Active' THEN 1 END) AS activeCount,
                        COUNT(AgentID) AS allAgents
                    FROM [Freight_Agents] 
                    WHERE AgentID != -99;`);

            res.status(200).json({ agents: result.recordset[0] });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Failed to fetch active agents count. Internal Server Error." });
    }
});

router.get("/shipments", authorizeRoles(['admin','mainUser']), async (req, res) => {
    try {
        const pool = await poolPromise;

        // Execute the query
        const result = await pool
            .request()
            .query(freightShipments);
            res.status(200).json({ shipments: result.recordset });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ message: "Failed to fetch shipment count. Internal Server Error." });
    }
});

module.exports = router;
