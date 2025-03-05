const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

//new order mail
router.post("/", async (req, res) => {
    const { to, subject, text, html } = req.body

    if ( !to || !subject ){
        return res.status(400).json({ Message: "Receiver mail, subject is missing."});
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
})

// // Function to send email
// const sendEmail = async (req, res) => {
//     const { to, subject, text } = req.body;

//     try {
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             text,
//         };

//         await transporter.sendMail(mailOptions);
//         res.status(200).json({ message: "Email sent successfully" });
//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.status(500).json({ error: "Failed to send email" });
//     }
// };

// // Attach the function to a route
// router.post("/send-email", sendEmail);

module.exports = router; // Export the router
