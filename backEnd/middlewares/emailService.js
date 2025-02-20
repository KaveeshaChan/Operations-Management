const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "cargoconnect.basilurtea@gmail.com",
        pass: "vxxg mhvc omyz ldwi",
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: "cargoconnect.basilurtea@gmail.com",
            to,
            subject,
            text,
        });
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
