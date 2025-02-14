const sql = require("mssql");
const cron = require("node-cron");
const { poolPromise } = require("../../../config/database");

const updateOrderStatus = async () => {
  try {
    const pool = await poolPromise;
    await pool.request().execute("UpdateOrderStatus");
    console.log("Order status updated automatically.");
  } catch (error) {
    console.error("Error updating order status:", error.message);
  }
};

// Schedule it to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running daily order status update...");
  updateOrderStatus();
});

module.exports = updateOrderStatus;