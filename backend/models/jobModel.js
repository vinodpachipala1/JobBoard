import { db } from "../config/database.js";

export const jobModel = {
    async createJob(jobData, userId) {
        const { title, description, requirements, category, job_type, location, salary_range, expires_at } = jobData;
        const result = await db.query(
            `INSERT INTO jobs (title, description, requirements, category, job_type, location, salary_range, expires_at, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [title, description, requirements, category, job_type, location, salary_range, expires_at, userId]
        );
        return result.rows[0];
    },

    async findJobsByEmployer(userId) {
        const result = await db.query(
            `SELECT j.*, c.name as company, c.description as company_description, c.logo_url as logo, c.website as website 
             FROM jobs j JOIN companies c ON j.user_id = c.user_id 
             WHERE j.user_id = $1`,
            [userId]
        );
        return result.rows;
    },

    async findAllJobs() {
        const result = await db.query(
            `SELECT j.*, c.name as company, c.description as company_description, c.logo_url as logo, c.website
             FROM jobs j LEFT JOIN companies c ON j.user_id = c.user_id 
             WHERE j.is_deleted = FALSE AND j.expires_at > now()`
        );
        return result.rows;
    },

    async findJobById(id) {
        const result = await db.query(
            `SELECT j.*, c.name as company, c.description as company_description, c.logo_url as logo, c.website
             FROM jobs j LEFT JOIN companies c ON j.user_id = c.user_id 
             WHERE j.id = $1`,
            [id]
        );
        return result.rows[0];
    },

    async softDeleteJob(id) {
        await db.query(
            `UPDATE jobs SET expires_at = now(), is_deleted = TRUE WHERE id = $1`,
            [id]
        );
    },

    async updateJob(jobData) {
        const { id, title, description, requirements, location, salary_range, job_type, category, expires_at } = jobData;
        await db.query(
            `UPDATE jobs SET updated_at = now(), title = $2, description = $3, requirements = $4, 
             location = $5, salary_range = $6, job_type = $7, category = $8, expires_at = $9 
             WHERE id = $1`,
            [id, title, description, requirements, location, salary_range, job_type, category, expires_at]
        );
    }
};

export default jobModel;