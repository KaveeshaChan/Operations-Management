const express = require("express");
const { sql, poolPromise } = require("../../../config/database");
const { updateOrderStatus } = require('../queries/updateOrderStatusQuery');
const { authorizeRoles } = require('../../../middlewares/authMiddleware');
const router = express.Router();

router.post("/", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
    const { OrderID, status } = req.body;
    
    if (!OrderID || !status) {
      return res.status(400).json({ message: "Order Number or status is not provided." });
    }
  
    try {
      const pool = await poolPromise;
  
      // Fetch document data
      await pool
        .request()
        .input("OrderID", sql.Int, OrderID)
        .input("orderStatus", sql.VarChar, status)
        .query(updateOrderStatus);

      res.status(200).json({message: "Order status updated successfully.",});
  
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});

module.exports = router;

// const { poolPromise } = require("../../../config/database");

// const updateOrderStatus = async () => {
//   try {
//     const pool = await poolPromise;
//     await pool.request().execute("UpdateOrderStatus");
//     console.log("Order status updated automatically.");
//   } catch (error) {
//     console.error("Error updating order status:", error.message);
//   }
// };

// module.exports = updateOrderStatus;