import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Job Board" <${process.env.SMTP_USER}>`, // Always use SMTP_USER
            to,
            subject,
            html,
        });
        console.log(`✅ Email sent to ${to}`);
    } catch (err) {
        console.error("❌ Error sending email:", err);
    }
};
