const express = require("express");
const { sql, poolPromise } = require("../../config/database");
const { viewQuotationForOrder } = require('../queries/quotationQueries/viewQuotationsQuery');
const { authorizeRoles } = require('../../../middlewares/authMiddleware');
const router = express.Router();

router.get("/", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
    const { orderNumber } = req.user;
    if (!orderNumber) return res.status(400).json({ message: "Order Number not provided." });

    try {
        const pool = await poolPromise;

        // Retrieve Orders
        const quotesQuery = await pool
            .request()
            .input("orderNumber", orderNumber)
            .query(viewQuotationForOrder);

        return res.status(200).json({ message: "Quotes retrieved successfully.", quotes: quotesQuery.recordset });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});

module.exports = router;