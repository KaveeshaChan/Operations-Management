const express = require("express");
const { sql, poolPromise } = require("../../config/database");
const { fetchAgentID, retrieveOrders, fetchDocumentData, retrieveOrderWithOrderID } = require('./queries/viewOrdersToAgentsQuery');
const { authorizeRoles } = require('../../middlewares/authMiddleware');
const router = express.Router();

router.get("/", async (req, res) => {
    const { userId } = req.user;
    if (!userId) return res.status(400).json({ message: "User ID not provided." });

    try {
        const pool = await poolPromise;

        // Fetch AgentID & Check if Agent is Active
        const agentCheck = await pool
            .request()
            .input("UserID", sql.Int, userId)
            .query(fetchAgentID);

        const { AgentID, IsActive } = agentCheck.recordset[0] || {};

        if (!AgentID) return res.status(404).json({ message: "Agent not found." });
        if (!IsActive) return res.status(403).json({ message: "Agent is not active." });

        // Retrieve Orders
        const ordersQuery = await pool.request().query(retrieveOrders);

        return res.status(200).json({ message: "Orders retrieved successfully.", orders: ordersQuery.recordset });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});

router.get("/exporter", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
    try {
        const pool = await poolPromise;
        const { orderID } = req.query; // Get orderID from query parameters
        const { status } = req.query;

        let result;
        if (orderID) {
            // If orderID is provided, fetch a specific order
            result = await pool.request()
                .input("orderID", sql.Int, orderID)
                .query(retrieveOrderWithOrderID);
        } else if (status){
            result = await pool.request()
                .input("orderStatus", sql.VarChar, status
                .query(retrieveOrders)
                )
        } else {
            // If no orderID, fetch all orders
            result = await pool.request().query(retrieveOrders);
        }
        return res.status(200).json({ message: "Orders retrieved successfully.", orders: result.recordset });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});

router.post("/documentData", async (req, res) => {
    const { orderNumber } = req.body;
    
    if (!orderNumber) {
      return res.status(400).json({ message: "Order Number not provided." });
    }
  
    try {
      const pool = await poolPromise;
  
      // Fetch document data
      const result = await pool
        .request()
        .input("orderNumber", sql.VarChar, orderNumber)
        .query(fetchDocumentData);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "No document found for this order number." });
      }
  
      const { documentData, documentName } = result.recordset[0];
  
      if (!documentData) {
        return res.status(404).json({ message: "No file uploaded for this order." });
      }
  
      // Convert Buffer to Base64 string for transmission
      const base64File = documentData.toString("base64");
  
      res.status(200).json({
        message: "Document retrieved successfully.",
        documentName,
        documentData: base64File,
      });
  
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});
  
module.exports = router;
