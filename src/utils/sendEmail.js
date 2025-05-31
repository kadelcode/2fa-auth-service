// Import the nodemailer library which allows sending emails from Node.js
const nodemailer = require('nodemailer');

// Export an asynchronous function that can be used to send emails
// The function takes an object with the following properties:
// - to: recipient's email address
// - subject: subject line of the email
// - html: HTML content of the email
module.exports = async function sendEmail({ to, subject, html}) {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail as the email service
        auth: {
            user: process.env.EMAIL_USER, // Email user from environment variables
            pass: process.env.EMAIL_PASS // Email password from environment variables
        },
    });

    // Use the transporter to send an email
    await transporter.sendMail({
        from: `"2FA Auth App" <${process.env.EMAIL_USER}>`, // Sender address with a friendly name
        to, // Receipient address(es) - passed to the function
        subject, // Email subject - passed to the function
        html, // HTML content of the email - passed to tht function
    });
};