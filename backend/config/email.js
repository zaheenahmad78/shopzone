const nodemailer = require('nodemailer');

// Hardcoded Ethereal credentials (temporary fix)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'carmen55@ethereal.email',
    pass: 'DFgDg8eUtNz8YDD2qx',
  },
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"ShopZone" <carmen55@ethereal.email>',
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent: ${info.messageId}`);
    console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = 'Welcome to ShopZone! 🎉';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h1 style="color: #3b82f6;">Welcome to ShopZone!</h1>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Thank you for registering! Start shopping now.</p>
      <a href="http://localhost:3000" style="background:#3b82f6; color:white; padding:10px 20px; text-decoration:none;">Shop Now</a>
      <p>ShopZone Team</p>
    </div>
  `;
  return await sendEmail(userEmail, subject, html);
};

module.exports = { sendEmail, sendWelcomeEmail };