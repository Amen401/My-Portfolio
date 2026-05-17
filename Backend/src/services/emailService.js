const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotificationEmail = async (name, email, message) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Portfolio Message from ${name}`,
    text: `From: ${email}\n\nMessage: ${message}`,
  });
};

// NEW: Function to send a reply to the user
const sendReplyEmail = async (toEmail, originalMessage, replyText) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `Re: Your message to Pawlos Gelgelo`,
    text: `You wrote:\n"${originalMessage}"\n\nReply from Pawlos:\n${replyText}`,
  });
};

module.exports = { sendNotificationEmail, sendReplyEmail };
