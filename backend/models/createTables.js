import { db } from "../config/database.js";

export const createTables = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                user_type VARCHAR(20) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
            
            CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                website VARCHAR(255), 
                logo_url VARCHAR(255),
                user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE 
            );
            
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                requirements TEXT NOT NULL,
                location VARCHAR(255) NOT NULL,
                salary_range VARCHAR(100) NOT NULL,
                job_type VARCHAR(50) NOT NULL,
                category VARCHAR(100) NOT NULL,
                user_id INTEGER NOT NULL REFERENCES users(id),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP NOT NULL,
                is_deleted BOOLEAN DEFAULT FALSE
            );
            
            CREATE TABLE IF NOT EXISTS applications (
                id SERIAL PRIMARY KEY,
                job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
                candidate_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                resume_filename VARCHAR(255),
                cover_letter TEXT,
                portfolio_link TEXT,
                linkedin_url TEXT,
                phone_number VARCHAR(20),
                status VARCHAR(20) NOT NULL DEFAULT 'Applied',
                status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                source VARCHAR(50) NOT NULL,
                resume_file BYTEA,
                UNIQUE(job_id, candidate_id)
            );
            
            CREATE TABLE IF NOT EXISTS candidate_profiles (
                id SERIAL PRIMARY KEY,
                user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                headline VARCHAR(255),
                bio TEXT,
                skills TEXT[],
                experience JSONB,
                education JSONB,
                linkedin_url TEXT,
                portfolio_url TEXT,
                github_url TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tables created successfully");
    } catch (err) {
        console.error("Error creating tables:", err);
        throw err;
    }
};

export default createTables;