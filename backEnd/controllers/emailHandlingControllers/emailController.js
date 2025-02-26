const nodemailer = require("nodemailer");

// Configure the transporter (use your own email service credentials)
const transporter = nodemailer.createTransport({
    service: "gmail", // Use "hotmail", "yahoo", etc., if using other services
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // App password or SMTP password
    },
});

// Function to send email
const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};

module.exports = { sendEmail };
