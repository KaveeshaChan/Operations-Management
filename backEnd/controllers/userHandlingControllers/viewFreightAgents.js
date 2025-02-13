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

router.get("/coordinators/:agentID", async (req, res) => {
  try {
      const { agentID } = req.params;
      console.log(agentID);

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

module.exports = router;
