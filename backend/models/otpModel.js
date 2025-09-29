import { db } from "../config/database.js";

export const otpModel = {
    // Create or update OTP for an email
    async upsertOtp(email, otp, expiresAt) {
        const result = await db.query(
            `INSERT INTO otp_codes (email, otp, expires_at)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO UPDATE 
            SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
            [email, otp, expiresAt]
        );
        return result.rows[0];
    },

    // Get OTP record by email
    async findOtpByEmail(email) {
        const result = await db.query(
            `SELECT otp, expires_at FROM otp_codes WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    },

    // Delete OTP record after verification
    async deleteOtp(email) {
        await db.query(
            `DELETE FROM otp_codes WHERE email = $1`,
            [email]
        );
    }
};

export default otpModel;
