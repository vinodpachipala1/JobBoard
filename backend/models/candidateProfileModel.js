import { db } from "../config/database.js";

export const candidateProfileModel = {
    async findProfileByUserId(userId) {
        const result = await db.query(
            `SELECT * FROM candidate_profiles WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0];
    },

    async upsertProfile(profileData, userId) {
        const { headline, bio, skills, experience, education, linkedin_url, portfolio_url, github_url } = profileData;
        
        const existingProfile = await this.findProfileByUserId(userId);
        
        if (existingProfile) {
            await db.query(
                `UPDATE candidate_profiles SET headline = $1, bio = $2, skills = $3, experience = $4, 
                 education = $5, linkedin_url = $6, portfolio_url = $7, github_url = $8, updated_at = NOW() 
                 WHERE user_id = $9`,
                [headline, bio, skills, JSON.stringify(experience), JSON.stringify(education), linkedin_url, portfolio_url, github_url, userId]
            );
        } else {
            await db.query(
                `INSERT INTO candidate_profiles (headline, bio, skills, experience, education, linkedin_url, portfolio_url, github_url, user_id) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [headline, bio, skills, JSON.stringify(experience), JSON.stringify(education), linkedin_url, portfolio_url, github_url, userId]
            );
        }
    }
};

export default candidateProfileModel;