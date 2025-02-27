const cron = require("node-cron");
const { poolPromise } = require("../../config/database");

async function cleanExpiredTokens() {
    try {
      const pool = await poolPromise;
      await pool.request().query('DELETE FROM TokenBlacklist WHERE ExpirationDateTime < GETDATE()');
      console.log('Expired tokens removed successfully');
    } catch (err) {
      console.error('Error cleaning expired tokens:', err);
    }
  }
  
// Schedule cleanup every 6 hours using cron
cron.schedule('0 */3 * * *', () => {
    cleanExpiredTokens();
});
  