const express = require("express");
const { sql, poolPromise } = require("../../../config/database");
const { selectQuoteForOrder, selectSelectedOrderDetails } = require('../queries/quotationQueries/quotationsQuery');
const { retrieveOrderWithOrderNumber } = require('../queries/viewOrdersToAgentsQuery')
const { generateForwarderSelectedEmail } = require('../../emailHandlingControllers/utils/emailTemps')
const { authorizeRoles } = require('../../../middlewares/authMiddleware');
const router = express.Router();

router.post("/", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    const { orderNumber, OrderQuoteID } = req.body;
    if (!orderNumber || !OrderQuoteID) {
        return res.status(400).json({ message: "Order Number or quotationID not provided." });
    }

    const pool = await poolPromise;

    const transaction = pool.transaction();
    try {
        await transaction.begin();

        // Update order to mark selected quote
        await transaction
            .request()
            .input("orderNumber", sql.VarChar, orderNumber)
            .input("OrderQuoteID", sql.Int, OrderQuoteID)
            .query(selectQuoteForOrder);

        // Fetch details of selected quote
        const selectedQuoteResult = await transaction
            .request()
            .input("OrderQuoteID", sql.Int, OrderQuoteID)
            .query(selectSelectedOrderDetails);

        if (selectedQuoteResult.recordset.length === 0) {
            throw new Error('No matching quotation details found.');
        }

        const selectedQuote = selectedQuoteResult.recordset[0];

        // Function to clean the quote data and remove null values
        const cleanSelectedQuote = (quote) => {
            const cleanedQuote = {};
            const excludedFields = ['AgentID', 'createdBy', 'Email'];
                    
            for (let key in quote) {
                if (quote[key] !== null && !excludedFields.includes(key)) {
                    cleanedQuote[key] = quote[key];
                }
            }
            return cleanedQuote;
        };
        
        const cleanedQuote = cleanSelectedQuote(selectedQuote);

        //fetch details of order
        const orderDetailsResult = await transaction
            .request()
            .input("orderNumber", orderNumber)
            .query(retrieveOrderWithOrderNumber)

        if (orderDetailsResult.recordset.length === 0) {
            throw new Error('No matching order details found.');
        }

        const orderDetails = orderDetailsResult.recordset[0];

        // Function to clean the quote data and remove null values
        const cleanSelectedOrder = (order) => {
            const cleanedOrderDetails = {};
            // const excludedFields = ['AgentID', 'createdBy', 'Email'];
                    
            for (let key in order) {
                if (order[key] !== null) {
                    cleanedOrderDetails[key] = order[key];
                }
            }
            return cleanedOrderDetails;
        };
        
        const cleanedOrderDetails = cleanSelectedOrder(orderDetails);

        // Prepare email payload with the cleaned quote data
        const emailPayload = {
            to: "thirimadurasandun@gmail.com, kaveeshachan@gmail.com",
            subject: `Basilur Tea Exports (Pvt) Ltd. selected you for - Order Number(${orderNumber })`,
            html: generateForwarderSelectedEmail({
                orderNumber,
                quoteData: cleanedQuote,
                orderDetails: cleanedOrderDetails
            }),
        };

        // Send email notification
        const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailPayload)
        });

        if (!emailResponse.ok) {
            throw new Error("Failed to send email notification");
        }

        // Commit transaction after everything succeeds
        await transaction.commit();

        return res.status(200).json({ message: "Freight Forwarder selected & order is completed." });

    } catch (error) {
        console.error('Error:', error.message);

        // Rollback transaction only if it was already started
        if (transaction.isActive) {
            await transaction.rollback();
        }

        return res.status(500).json({ message: 'Failed to select quotation or send email. ' + error.message });
    }
});

module.exports = router;
