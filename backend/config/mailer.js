import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_SENDER, // Verified sender in SendGrid
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err.response?.body || err);
  }
};
