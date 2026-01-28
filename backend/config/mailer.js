import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Set SendGrid API Key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendEmail = async (to, subject, html) => {
//   try {
//     await sgMail.send({
//       to,
//       from: process.env.SENDGRID_SENDER, // Verified sender in SendGrid
//       subject,
//       html,
//     });
//     console.log(`✅ Email sent to ${to}`);
//   } catch (err) {
//     console.error("❌ Error sending email:", err.response?.body || err);
//   }
// };

export const sendEmail = async (to, subject, html) => {
  
  const apiKey = process.env.BREVO_API_KEY; 

  
  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: "Job Board", email: "jobboad08@gmail.com" }, // Change this to your login email
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
      }
    );
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email Failed:", error.response ? error.response.data : error.message);
  }
};