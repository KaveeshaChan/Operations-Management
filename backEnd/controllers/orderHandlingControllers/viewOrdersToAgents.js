const express = require("express");
const { sql, poolPromise } = require("../../config/database");
const { fetchAgentID, 
        retrieveOrders, 
        fetchDocumentData, 
        retrieveOrderWithOrderID, 
        retrieveCompletedOrders, 
        retrieveInPtogressOrders,
        retrieveCancelledOrders,
        retrieveCompletedOrdersForAgent, orderCounts } = require('./queries/viewOrdersToAgentsQuery');
const { selectPreviousQuotes } = require('./queries/quotationQueries/quotationsQuery');
const { authorizeRoles } = require('../../middlewares/authMiddleware');
const router = express.Router();

router.get("/", authorizeRoles(['freightAgent', 'coordinator']), async (req, res) => {
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
        const ordersQuery = await pool
            .request()
            .input("orderStatus", 'active')
            .input("AgentID", AgentID)
            .query(retrieveInPtogressOrders);

        return res.status(200).json({ message: "Orders retrieved successfully.", orders: ordersQuery.recordset });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});

router.get("/exporter", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
    try {
        const pool = await poolPromise;
        const { OrderID, status } = req.query; // Get orderID & status from query parameters

        let result;
        if (OrderID) {

          // Fetch a specific order
          result = await pool.request()
            .input("OrderID", sql.Int, OrderID)
            .query(retrieveOrderWithOrderID);

        } else {

          if (status == 'completed'){

            // Fetch orders based on status or use 'active' as default
            result = await pool.request()
            .input("orderStatus", sql.VarChar, status || 'completed')
            .query(retrieveCompletedOrders);

          } else if (status == 'cancelled'){
            // Fetch orders based on status or use 'active' as default
            result = await pool.request()
            .input("orderStatus", sql.VarChar, status || 'active')
            .query(retrieveCancelledOrders);
          }else {
            // Fetch orders based on status or use 'active' as default
            result = await pool.request()
            .input("orderStatus", sql.VarChar, status || 'active')
            .query(retrieveOrders);
          }
        }

        return res.status(200).json({ message: "Orders retrieved successfully.", orders: result.recordset });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});

router.post("/documentData", authorizeRoles(['admin', 'mainUser', 'freightAgent', 'coordinator']), async (req, res) => {
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

router.get("/completed", authorizeRoles(['freightAgent', 'coordinator']), async (req, res) => {

  const { agentID, userId } = req.user
  if (!agentID) {
      return res.status(400).json({ message: "Couldn't get the agent ID." });
  }

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("AgentID", agentID)
      .query(retrieveCompletedOrdersForAgent)

      return res.status(200).json({ message: "Orders retrieved successfully.", orders: result.recordset });
  } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
});

router.get("/quoted", authorizeRoles(['freightAgent', 'coordinator']), async (req, res) => {
  const { agentID, userId } = req.user
  if (!agentID) {
      return res.status(400).json({ message: "Couldn't get the agent ID." });
  }
  const pool = await poolPromise;

  // Fetch AgentID & Check if Agent is Active
  const agentCheck = await pool
    .request()
    .input("UserID", userId)
    .query(fetchAgentID);

  const { IsActive } = agentCheck.recordset[0] || {};
  if (!IsActive) return res.status(403).json({ message: "Agent is not active." });

  try {

      // Retrieve Orders
      const quoted = await pool
          .request()
          .input("AgentID", agentID)
          .input("orderStatus", 'active')
          .query(selectPreviousQuotes);

      return res.status(200).json({ message: "Retrived previous quotations.", quotedOrders: quoted.recordset });
  } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
});

router.get("/order-counts", authorizeRoles(['admin', 'mainUser']), async (req, res) => {

  try {
    const pool = await poolPromise;

      // Retrieve Orders
      const result = await pool
          .request()
          .query(orderCounts);

      return res.status(200).json({ orderCounts: result.recordset[0] });
  } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
});

router.get("/cancelled-counts", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
  const { cancelledFilterType, cancelledFilterValue } = req.query;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    let query = `SELECT 
      COUNT(CASE WHEN orderStatus = 'cancelled' THEN 1 END) AS allCancelledOrders
      FROM OrderDocs `;

      if (cancelledFilterType === 'year') {
        query += ` WHERE YEAR(cancelledDate) = @year`;
        request.input('year', sql.Int, parseInt(cancelledFilterValue));
      } else if (cancelledFilterType === 'month') {
        const [year, month] = cancelledFilterValue.split('-');
        query += ` WHERE YEAR(cancelledDate) = @year AND MONTH(cancelledDate) = @month`;
        request.input('year', sql.Int, parseInt(year));
        request.input('month', sql.Int, parseInt(month));
      } else if (cancelledFilterType === 'date') {
        query += ` WHERE CAST(cancelledDate AS DATE) = @date`;
        request.input('date', sql.Date, new Date(cancelledFilterValue));
      }

    const result = await request.query(query);
    return res.status(200).json({ cancelledCounts: result.recordset[0] });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
});
  
module.exports = router;
