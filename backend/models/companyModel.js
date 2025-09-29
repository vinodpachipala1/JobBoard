import { db } from "../config/database.js";

export const companyModel = {
    async createCompany(name, description, website, logoUrl, userId) {
        const result = await db.query(
            `INSERT INTO companies (name, description, website, logo_url, user_id) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, description, website, logoUrl, userId]
        );
        return result.rows[0];
    },

    async findCompanyByUserId(userId) {
        const result = await db.query(
            `SELECT * FROM companies WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0];
    },

    async updateCompany(name, description, website, logoUrl, userId) {
        const result = await db.query(
            `UPDATE companies SET name = $1, description = $2, website = $3, logo_url = $4 
             WHERE user_id = $5 RETURNING *`,
            [name, description, website, logoUrl, userId]
        );
        return result.rows[0];
    }
};

export default companyModel;