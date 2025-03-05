const express = require("express");
const { sql, poolPromise } = require("../../../config/database");
const { addToCancelOrder } = require('../queries/updateOrderStatusQuery');
const { authorizeRoles } = require('../../../middlewares/authMiddleware');
const router = express.Router();

router.post("/", authorizeRoles(['admin', 'mainUser']), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
  }

  const { OrderID, orderStatus, reason } = req.body;
  const cancelledBy = req.user.userId;

  if (!OrderID || !orderStatus || !reason) {
      return res.status(400).json({ message: "Order Number, status, or reason is not provided." });
  }

  const pool = await poolPromise;

  const transaction = pool.transaction();
  await transaction.begin();

  try {
      // Perform SQL update and retrieve order number
      const result = await transaction
          .request()
          .input("OrderID", sql.Int, OrderID)
          .input("orderStatus", sql.NVarChar, orderStatus)
          .input("cancelledReason", sql.VarChar, reason)
          .input("cancelledBy", sql.VarChar, String(cancelledBy))
          .output("OrderNumber", sql.VarChar)
          .query(addToCancelOrder);

      const orderNumber = result.output.OrderNumber;

      // Fetch freight agent emails
      const agentEmailsResponse = await fetch('http://localhost:5056/api/select/view-freight-agents/emails', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      });

      if (!agentEmailsResponse.ok) {
          throw new Error('Failed to fetch agent emails');
      }

      const agentEmailsData = await agentEmailsResponse.json();
      const activeAgentEmails = agentEmailsData.agents.map(agent => agent.Email).join(",");

      // Prepare better email content (HTML format)
      const emailPayload = {
          to: "thirimadurasandun@gmail.com",
          subject: `Order Cancellation Notice - Basilur Tea Exports - Order #${orderNumber}`,
          html: `
                <p style="margin: 0 0 16px 0;">We regret to inform you that Order <strong>${orderNumber}</strong> has been formally canceled effective immediately. Please update your records accordingly.</p>

                  <div style="margin: 20px 0; background: #f9f9f9; padding: 15px; border-radius: 4px;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; width: 35%;"><strong>Order Reference</strong></td>
                        <td style="padding: 10px; color: red; border-bottom: 1px solid #e0e0e0;">${orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Cancellation Rationale</strong></td>
                        <td style="padding: 10px; color: red; border-bottom: 1px solid #e0e0e0;">${reason}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="margin: 16px 0;">We sincerely apologize for any inconvenience this cancellation may cause. Please note this cancellation is final and irrevocable.</p>

                  <p style="margin: 16px 0;">For clarification or assistance with future orders, please contact our Logistics Coordination Team:</p>

                  <ul style="margin: 16px 0; padding-left: 20px;">
                    <li>Email: operations@basilurtea.com, cargoconnect.basilurtea@gmail.com</li>
                    <li>Direct Line: (+94) 11 2549500/2549600 (Ext. 4308)</li>
                    <li>Fax: (+94) 11 2549444 </li>
                  </ul>

                  <p style="margin: 16px 0;">We appreciate your understanding and remain committed to maintaining our valuable partnership.</p>

                  <p style="margin: 16px 0;">Best Regards,<br>
                    <strong>Logistics Operations</strong><br>
                      Basilur Tea Exports (Pvt) Ltd<br>
                      143/6, Weediybandara Mawatha,<br>
                      Kelanimulla,<br>
                      Angoda,<br>
                      Sri Lanka (Ceylon)</p>

                  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eeeeee; font-size: 0.9em; color: #666666;">
                    <p style="margin: 4px 0;"> Web: www.basilurtea.com | www.tipsontea.com</p>
                  </div>
            `,
      };

      // Send email
      const emailResponse = await fetch('http://localhost:5056/api/send-email/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload),
      });

      if (!emailResponse.ok) {
          throw new Error("Failed to send email notification");
      }

      // Commit transaction if everything succeeded
      await transaction.commit();

      res.status(200).json({ message: "Order cancelled successfully.", orderNumber });

  } catch (err) {
      console.error("Error:", err.message);

      await transaction.rollback();

      res.status(500).json({ message: 'Failed to cancel order or send email. ' + err.message });
  }
});

module.exports = router;