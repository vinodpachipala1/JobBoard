import express, { application } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import multer from "multer";

const port = 3001;
const app = express();
dotenv.config();



const upload = multer({ storage: multer.memoryStorage() })
const db = new Pool({
    user: process.env.user,
    host: process.env.host,
    password: process.env.password,
    database: process.env.database,
    port: process.env.port,
})

app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);

const saltrounds = 10;

const createTables = async () => {
    try {
        db.query(`
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
        console.log("Tables created Successfully")
    } catch (err) {
        console.log(err);
    }
}

createTables();


app.post("/register", async (req, res) => {
    const { fname, lname, email, password, confirmPassword, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const result = await db.query(`INSERT INTO users (email, first_name, last_name, password, user_type) VALUES($1, $2, $3, $4, $5) RETURNING id`, [email, fname, lname, hashedPassword, role])
        res.send("Successfull");
    }
    catch (err) {
        console.log(err);
        if (err.code === "23505") {
            console.log(err.code);
            res.status(500).json({ error: "Email Already Exist!" })
        }
        else {
            res.status(500).json({ error: "Server error" });
        }
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query(`SELECT id, password, user_type, first_name, last_name FROM users WHERE email = $1`, [email]);
        const user = result.rows[0];


        if (!user) {
            return res.status(404).send("User Not Found!")
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid Password");
        }

        const payload = {
            user: {
                id: user.id,
                role: user.user_type,
                email: email,
                fname: user.first_name,
                lname: user.last_name,
            },
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token, user: payload.user });

    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message });
    }
})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Not logged in" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token" });
        req.user = user;
        next();
    });
};

app.get("/verify-login", authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// to get candidate profile
app.get("/candidate/profile", authenticateToken, async(req, res) =>{
    const userId = req.user.user.id;
    try{
        const result = await db.query(`SELECT * FROM candidate_profiles WHERE user_id = $1`,[userId]);
        res.send({profile : result.rows[0]});
    } catch (err){
        console.log(err);
    }
})

app.post("/candidate/profile", async(req, res) => {
    const {formData, userId} = req.body;
    const {headline, bio, skills, experience, education, linkedin_url, portfolio_url, github_url} = formData;
    console.log(experience)
    try{

        const result = await db.query(`SELECT * FROM candidate_profiles WHERE user_id = $1`,[userId]);
        if(result.rows.length < 0){
            await db.query("INSERT INTO candidate_profiles ( headline, bio, skills, experience, education, linkedin_url, portfolio_url, github_url, user_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [headline, bio, skills, JSON.stringify(experience), JSON.stringify(education), linkedin_url, portfolio_url, github_url, userId])
        } else {
            await db.query("UPDATE candidate_profiles SET headline = $1, bio = $2, skills = $3, experience = $4, education = $5, linkedin_url = $6, portfolio_url = $7, github_url = $8 WHERE user_id = $9", [headline, bio, skills, JSON.stringify(experience), JSON.stringify(education), linkedin_url, portfolio_url, github_url, userId])
        }
        res.send();
    }
    catch(err) {
        console.log(err);
    }
})



// add Companies
app.post("/addCompany", async (req, res) => {
    const { name, website, logo_url, description } = req.body.companyprofile;
    const userId = req.body.userId;

    try {
        const result = await db.query(`INSERT INTO companies (name, description, website, logo_url, user_id) VALUES ($1, $2, $3, $4, $5) returning *`, [name, description, website, logo_url, userId]);
        res.send({ company: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log(err);
    }
})

// get Company
app.post("/getCompanyDetails", async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM companies WHERE user_id = $1`, [req.body.userId])
        res.send({ company: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log(err);
    }
})

// UPDATE COMPANY DETAILS
app.put("/updateCompany", async (req, res) => {
    const { name, website, logo_url, description } = req.body.companyprofile;
    const userId = req.body.userId;
    try {
        const result = await db.query(`UPDATE  companies SET name = $1, description = $2, website = $3, logo_url = $4 WHERE user_id = $5 returning *`, [name, description, website, logo_url, userId]);
        res.send({ company: result.rows[0] });

    } catch (err) {
        console.log(err);
    }
})

//create New Job
app.post("/CreateNewJob", async (req, res) => {
    const { title, description, requirements, category, job_type, location, salary_range, expires_at } = req.body.jobDetails;
    const userId = req.body.userId;

    try {
        const result = await db.query(`INSERT INTO jobs (title, description, requirements, category, job_type, location, salary_range, expires_at, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`, [title, description, requirements, category, job_type, location, salary_range, expires_at, userId]);
        res.send("Success");
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed");
    }
})

// load employeer Posted jobs
app.post("/getEmployerJobs", async (req, res) => {
    const userId = req.body.userId;
    try {
        const result = await db.query(`SELECT j.*, c.name as company, c.description as company_description, c.logo_url as logo, c.website as website FROM jobs j JOIN companies c ON j.user_id = c.user_id WHERE j.user_id = $1`, [userId]);

        res.send({ jobs: result.rows })
    } catch (err) {
        console.log(err);
    }
})

//Delete job
app.post("/DeleteJob", async (req, res) => {
    const id = req.body.id;
    try {
        await db.query(`UPDATE jobs SET expires_at = now(), is_deleted = TRUE WHERE id = $1`, [id]);

        res.send("Successfull")
    } catch (err) {
        console.log(err);
    }
})

// edit Job Details
app.post("/EditJob", async (req, res) => {

    const { id, title, description, requirements, location, salary_range, job_type, category, user_is, created_at, updated_at, expires_at } = req.body;
    try {
        await db.query(`UPDATE jobs SET updated_at = now(), title = $2, description = $3, requirements = $4, location = $5, salary_range = $6, job_type = $7, category = $8, expires_at = $9 WHERE id = $1`, [id, title, description, requirements, location, salary_range, job_type, category, expires_at]);
        res.send("Successfull")
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed");
    }
})

// get all jobs
app.get("/jobs", async (req, res) => {
    try {
        const result = await db.query(`SELECT j.*, 
            c.name as company, c.description as company_description, c.logo_url as logo, c.website
            FROM jobs j 
            LEFT JOIN companies c ON j.user_id = c.user_id WHERE j.is_deleted = FALSE AND j.expires_at > now()`);
        res.send({ jobs: result.rows })
    } catch (err) {
        console.log(err);
    }
})

//get job details
app.post("/getJobDetils", async(req, res) => {
    const id= req.body.id;
    
    try {
        const result = await db.query(`SELECT j.*, 
            c.name as company, c.description as company_description, c.logo_url as logo, c.website
            FROM jobs j 
            LEFT JOIN companies c ON j.user_id = c.user_id WHERE j.id = $1`, [id]);
            
        res.send({ job: result.rows[0] })
    } catch (err) {
        console.log(err);
    }
})

//post application
app.post("/postApplication", upload.single('resume'), async (req, res) => {
    const file = req.file;
    const { jobId, userId, phone_number, cover_letter, portfolio_link, linkedin_url, source } = req.body;

    if (!file) {
        return res.status(400).json({ error: 'Resume file is required.' });
    }

    try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFilename = `resume-${userId}-${jobId}-${uniqueSuffix}.pdf`;

        // Store file as bytea in PostgreSQL
        const result = await db.query(
            `INSERT INTO applications (job_id, candidate_id, phone_number, cover_letter, portfolio_link, linkedin_url, source, resume_filename, resume_file) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [jobId, userId, phone_number, cover_letter, portfolio_link, linkedin_url, source, newFilename, file.buffer]
        );

        res.json({
            success: true,
            message: "Application submitted successfully",
            applicationId: result.rows[0].id
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: "You have already applied for this job." });
        }
        console.error("Application submission error:", err);
        res.status(500).json({ error: 'Failed to submit application.' });
    }
});

// converting to resume urls
const addResumeUrls = (applications, req) => {
    return applications.map(app => {
        if (app.resume_filename && app.resume_file) {
            const downloadUrl = `${req.protocol}://${req.get('host')}/downloadResume/${app.id}`;
            return {
                ...app,
                resumeUrl: downloadUrl,
                hasResume: true
            };
        }
        return {
            ...app,
            resumeUrl: null,
            hasResume: false
        };
    });
};

// get employee applicatins for the job
app.post("/getEmployeerApplications", async (req, res) => {
    const jobId = req.body.jobId;

    try {
        const result = await db.query(
            `SELECT a.*, u.first_name as candidate_fname, u.last_name as candidate_lname, u.email as candidate_email
             FROM applications a
             JOIN users u ON a.candidate_id = u.id
             WHERE a.job_id = $1`,
            [jobId]
        );

        const applicationsWithUrls = addResumeUrls(result.rows, req);
        res.json({ applications: applicationsWithUrls });

    } catch (err) {
        console.error("Error fetching employer applications:", err);
        res.status(500).json({ error: "Failed to fetch job applications." });
    }
});


// to show pdf in the browser
app.get("/downloadResume/:applicationId", async (req, res) => {
    const { applicationId } = req.params;

    try {
        const result = await db.query(
            `SELECT resume_filename, resume_file 
             FROM applications WHERE id = $1`,
            [applicationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const { resume_filename, resume_file } = result.rows[0];

        if (!resume_file) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${resume_filename}"`);
        res.setHeader('Content-Length', resume_file.length);

        res.send(resume_file);

    } catch (err) {
        console.error("Resume view error:", err);
        res.status(500).json({ error: 'Failed to load resume' });
    }
});

//update application status
app.put("/updateApplicationStatus", async (req, res) => {
    const { application_id, application_status } = req.body;
    try {
        await db.query(`UPDATE applications SET status_updated_at = now(), status = $1 WHERE id = $2`, [application_status, application_id])
        res.send("success")
    } catch (err) {
        console.log(err);
    }

})

// to display all candidate applications
app.post("/getCandidateApplications", async (req, res) => {
    const userId = req.body.userId;
    try {
        const result = await db.query(`SELECT a.*, u.first_name as candidate_fname, u.last_name as candidate_lname, u.email as candidate_email,  
                c.name as company_name, c.logo_url as company_logo,
                j.job_type, j.salary_range, j.location, j.title as job_title

             FROM applications a
             JOIN users u ON a.candidate_id = u.id
             JOIN jobs j ON a.job_id = j.id
             JOIN companies c ON c.user_id = j.user_id
             WHERE a.candidate_id = $1`, [userId])
        const applicationsWithUrls = addResumeUrls(result.rows, req);
        res.send({applications : applicationsWithUrls})
    } catch (err) {
        console.log(err)
    }
})



app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})