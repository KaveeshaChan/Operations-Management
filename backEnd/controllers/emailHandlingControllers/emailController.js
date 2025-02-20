const express = require("express");
const sendEmail = require("../../middlewares/emailService");
const router = express.Router();

router.post("/new-order", async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        await sendEmail(to, subject, text);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email" });
    }
});

module.exports = router;
