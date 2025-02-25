const express = require("express");
const { sql, poolPromise } = require("../../../config/database");
const { addToCancelOrder } = require('../queries/updateOrderStatusQuery');
const { authorizeRoles } = require('../../../middlewares/authMiddleware');
const router = express.Router();

router.post("/", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
    const { OrderID, orderStatus, reason } = req.body;
    const cancelledBy = req.user.userId;
    
    if (!OrderID || !orderStatus || !reason) {
      return res.status(400).json({ message: "Order Number, status or reason is not provided." });
    }
  
    try {
      const pool = await poolPromise;
  
      // Fetch document data
      await pool
        .request()
        .input("OrderID", sql.Int, OrderID)
        .input("orderStatus", sql.NVarChar, orderStatus)
        .input("cancelledReason", sql.VarChar, reason)
        .input("cancelledBy", sql.VarChar, String(cancelledBy))
        .query(addToCancelOrder);

      res.status(200).json({message: "Order cancelled successfully.",});
  
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});

module.exports = router;