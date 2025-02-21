const express = require("express");
const { sql, poolPromise } = require("../../../config/database");
const { selectQuoteForOrder } = require('../queries/quotationQueries/quotationsQuery');
const { authorizeRoles } = require('../../../middlewares/authMiddleware');
const router = express.Router();

router.post("/", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
    const { orderNumber, OrderQuoteID } = req.body;
    if (!orderNumber || !OrderQuoteID) return res.status(400).json({ message: "Order Number or quotationID not provided." });

    try {
        const pool = await poolPromise;

        // Retrieve Orders
        await pool
            .request()
            .input("orderNumber", sql.VarChar, orderNumber)
            .input("OrderQuoteID", sql.Int,OrderQuoteID)
            .query(selectQuoteForOrder);

        return res.status(200).json({ message: "Freight Forwarder selected & order is completed." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});

module.exports = router;