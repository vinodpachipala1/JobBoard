import { db } from "../config/database.js";

export const applicationModel = {
    async createApplication(applicationData, fileBuffer, filename) {
        const { jobId, userId, phone_number, cover_letter, portfolio_link, linkedin_url, source } = applicationData;
        
        const result = await db.query(
            `INSERT INTO applications (job_id, candidate_id, phone_number, cover_letter, portfolio_link, linkedin_url, source, resume_filename, resume_file) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [jobId, userId, phone_number, cover_letter, portfolio_link, linkedin_url, source, filename, fileBuffer]
        );
        return result.rows[0];
    },

    async findApplicationsByJobId(jobId) {
        const result = await db.query(
            `SELECT a.*, u.first_name as candidate_fname, u.last_name as candidate_lname, u.email as candidate_email
             FROM applications a JOIN users u ON a.candidate_id = u.id 
             WHERE a.job_id = $1`,
            [jobId]
        );
        return result.rows;
    },

    async findApplicationsByCandidateId(userId) {
        const result = await db.query(
            `SELECT a.*, u.first_name as candidate_fname, u.last_name as candidate_lname, u.email as candidate_email,  
             c.name as company_name, c.logo_url as company_logo,
             j.job_type, j.salary_range, j.location, j.title as job_title
             FROM applications a
             JOIN users u ON a.candidate_id = u.id
             JOIN jobs j ON a.job_id = j.id
             JOIN companies c ON c.user_id = j.user_id
             WHERE a.candidate_id = $1`,
            [userId]
        );
        return result.rows;
    },

    async findApplicationById(applicationId) {
        const result = await db.query(
            `SELECT resume_filename, candidate_id, resume_file FROM applications WHERE id = $1`,
            [applicationId]
        );
        return result.rows[0];
    },

    async updateApplicationStatus(applicationId, status) {
        await db.query(
            `UPDATE applications SET status_updated_at = now(), status = $1 WHERE id = $2`,
            [status, applicationId]
        );
    }
};

export default applicationModel;