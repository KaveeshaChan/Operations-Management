function generateFreightRequestEmail({ orderNumber, routeFrom, routeTo, shipmentType, shipmentReadyDate, targetDate }) {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 800px; margin: auto;">

    <div style="padding: 20px; border: 1px solid #eeeeee; border-radius: 8px; margin-top: 20px;">

        <!-- Logo Section -->
        <table style="width: 100%; text-align: center; margin-bottom: 20px;">
            <tr>
                <td style="width: 50%; text-align: right; padding-right: 10px;">
                    <img src="localhost:5056/src/images/logo/basilurlogo.png" alt="Basilur Logo" style="max-height: 60px;">
                </td>
                <td style="width: 50%; text-align: left; padding-left: 10px;">
                    <img src="localhost:5056/src/images/logo/CargoLogo.png" alt="Cargo Connect Logo" style="max-height: 60px;">
                </td>
            </tr>
        </table>

        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2c5f2d; margin: 10px 0;">New Freight Request</h2>
            <h3 style="margin: 10px 0; color: #4a4a4a;">Order Number: ${orderNumber}</h3>
        </div>

        <div style="margin-bottom: 25px;">
            <p>Dear Valued Freight Partner,</p>
            <p>We are pleased to invite your quotation for the following shipment request:</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; padding: 20px; border-radius: 6px;">
            <tr><td><strong>Route</strong></td><td>${routeFrom} to ${routeTo}</td></tr>
            <tr><td><strong>Shipment Type</strong></td><td>${shipmentType}</td></tr>
            <tr><td><strong>Shipment Ready Date</strong></td><td>${shipmentReadyDate}</td></tr>
            <tr><td><strong>Target Date</strong></td><td>${targetDate}</td></tr>
        </table>

        <div style="text-align: center; margin: 20px 0;">
            <p><strong>Action Required:</strong> Please submit your quotation through our system.</p>
            <a href="http://localhost:3000/login" style="background-color: #2c5f2d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Submit Quotation
            </a>
            <p>If the button above doesn't work, copy and paste this link:<br>
            <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
        </div>

        <div style="border-top: 1px solid #eeeeee; padding-top: 10px; font-size: 0.9em; color: #666;">
            <p>For inquiries, contact Logistics Coordination Team:</p>
            <p>📧 operations@basilurtea.com | cargoconnect.basilurtea@gmail.com</p>
            <p>📞 (+94) 11 2549500/2549600 (Ext. 4308) | 📠 (+94) 11 2549444</p>
            <p>🌐 <a href="http://www.basilurtea.com">www.basilurtea.com</a> | <a href="http://www.tipsontea.com">www.tipsontea.com</a></p>
        </div>
    </div>

    </body>
    </html>`;
}

function generateNewFreightAgentEmail({ name, email, password }) {
    return `
        <!DOCTYPE html>
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 800px; margin: auto;">

                <div style="padding: 20px; border: 1px solid #eeeeee; border-radius: 8px; margin-top: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <!-- <img src="https://example.com/logo.png" alt="Basilur Tea Exports Logo" style="max-width: 200px; margin-bottom: 20px;"> -->
                        <h2 style="color: #2c5f2d; margin: 10px 0;">Welcome to Cargo Connect</h2>
                            <h3 style="margin: 10px 0; color: #4a4a4a;">Your Cargo Connect Account has been Created</h3>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <p style="margin: 0 0 16px 0;">Dear ${name},</p>
                        <p style="margin: 0 0 16px 0;">Welcome to <strong>Cargo Connect</strong>, the freight management system by Basilur Tea Exports (Pvt) Ltd. Your account has been successfully created, and you can now access the system using the credentials below:</p>
                    </div>

                    <div style="margin: 20px 0; background: #f9f9f9; padding: 20px; border-radius: 6px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; width: 40%;"><strong>Login URL</strong></td>
                                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
                                    <a href="http://localhost:3000/login" style="color: #1a0dab; text-decoration: none;">
                                        http://localhost:3000/login
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Email</strong></td>
                                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;"><strong>Temporary Password</strong></td>
                                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${password}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="margin: 25px 0;">
                        <p style="margin: 16px 0;"><strong>Important:</strong></p>
                        <ul style="margin: 16px 0; padding-left: 20px;">
                            <li>Use the provided credentials to log in to the system.</li>
                            <li>You will be prompted to change your password upon first login.</li>
                            <li>Keep your login details secure and do not share them with anyone.</li>
                        </ul>
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 0.9em; color: #666666;">
                        <p style="margin: 8px 0;">For assistance, contact our Logistics Coordination Team:</p>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>📧 operations@basilurtea.com | cargoconnect.basilurtea@gmail.com</li>
                            <li>📞 (+94) 11 2549500/2549600 (Ext. 4308)</li>
                            <li>📠 (+94) 11 2549444</li>
                        </ul>
                        <p style="margin: 8px 0;">🌐 <a href="https://www.basilurtea.com" style="color: #1a0dab; text-decoration: none;">www.basilurtea.com</a> | <a href="https://www.tipsontea.com" style="color: #1a0dab; text-decoration: none;">www.tipsontea.com</a></p>
                    </div>
                </div>

            </body>
        </html>
    `;
}

function generatePasswordResetEmail({ resetToken, email }) {
    return `
        <!DOCTYPE html>
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 800px; margin: auto;">

                <div style="padding: 20px; border: 1px solid #eeeeee; border-radius: 8px; margin-top: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #2c5f2d; margin: 10px 0;">Cargo Connect - Password Reset Request</h2>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <p style="margin: 0 0 16px 0;">Dear User,</p>
                        <p style="margin: 0 0 16px 0;">We received a request to reset your password for your <strong>Cargo Connect</strong> account associated with this email: <strong>${email}</strong>.</p>
                        <p style="margin: 0 0 16px 0;">To reset your password, please click the button below:</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/password-reset?token=${resetToken}" 
                           style="background-color: #2c5f2d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            Reset Password
                        </a>
                    </div>

                    <p style="margin: 0 0 16px 0;">If you didn’t request a password reset, please ignore this email or contact our support team if you have any concerns.</p>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 0.9em; color: #666666;">
                        <p style="margin: 8px 0;">For assistance, contact our Logistics Coordination Team:</p>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>📧 operations@basilurtea.com | cargoconnect.basilurtea@gmail.com</li>
                            <li>📞 (+94) 11 2549500/2549600 (Ext. 4308)</li>
                            <li>📠 (+94) 11 2549444</li>
                        </ul>
                        <p style="margin: 8px 0;">🌐 <a href="https://www.basilurtea.com" style="color: #1a0dab; text-decoration: none;">www.basilurtea.com</a> | <a href="https://www.tipsontea.com" style="color: #1a0dab; text-decoration: none;">www.tipsontea.com</a></p>
                    </div>
                </div>

            </body>
        </html>
    `;
}

function generateForwarderSelectedEmail({ orderNumber, quoteData }) {
    // Dynamically generate the content for the quote data
    let quoteContent = '<ul>';

    // Loop through quoteData and add only the non-null fields
    for (let key in quoteData) {
        if (quoteData[key] !== null && quoteData[key] !== undefined) {
            quoteContent += `<li><strong>${key}</strong>: ${quoteData[key]}</li>`;
        }
    }

    quoteContent += '</ul>';

    // Returning the email template with dynamically added quote content
    return `
        <!DOCTYPE html>
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 800px; margin: auto;">
                <div style="padding: 20px; border: 1px solid #eeeeee; border-radius: 8px; margin-top: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #2c5f2d; margin: 10px 0;">Cargo Connect - Freight Forwarder Selected</h2>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <p style="margin: 0 0 16px 0;">Dear User,</p>
                        <p style="margin: 0 0 16px 0;">We are pleased to inform you that the following quote has been selected for Order Number <strong>${orderNumber}</strong>:</p>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <p style="margin: 0 0 16px 0;">The selected quote details are as follows:</p>
                        ${quoteContent}
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 0.9em; color: #666666;">
                        <p style="margin: 8px 0;">For assistance, contact our Logistics Coordination Team:</p>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>📧 operations@basilurtea.com | cargoconnect.basilurtea@gmail.com</li>
                            <li>📞 (+94) 11 2549500/2549600 (Ext. 4308)</li>
                            <li>📠 (+94) 11 2549444</li>
                        </ul>
                        <p style="margin: 8px 0;">🌐 <a href="https://www.basilurtea.com" style="color: #1a0dab; text-decoration: none;">www.basilurtea.com</a> | <a href="https://www.tipsontea.com" style="color: #1a0dab; text-decoration: none;">www.tipsontea.com</a></p>
                    </div>
                </div>
            </body>
        </html>
    `;
}

module.exports = { generateFreightRequestEmail, generateNewFreightAgentEmail, generatePasswordResetEmail, generateForwarderSelectedEmail };
