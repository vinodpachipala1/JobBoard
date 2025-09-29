import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from 'nodemailer';

// Import database and models
import { db } from "./config/database.js";
import createTables from "./models/createTables.js";
import userModel from "./models/userModel.js";
import companyModel from "./models/companyModel.js";
import jobModel from "./models/jobModel.js";
import applicationModel from "./models/applicationModel.js";
import candidateProfileModel from "./models/candidateProfileModel.js";
import { sendEmail } from "./config/mailer.js";

const port = 3001;
const app = express();
dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

// Initialize database tables
createTables();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.set("trust proxy", 1);

const saltrounds = 10;

// Authentication middleware
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

// Helper function for resume URLs
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

// ============ AUTHENTICATION ROUTES ============
app.post("/register", async (req, res) => {
    const { fname, lname, email, password, confirmPassword, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await userModel.createUser(email, fname, lname, hashedPassword, role);
        res.json({ message: "Registration successful", user: { id: user.id, email: user.email } });
    } catch (err) {
        console.log(err);
        if (err.code === "23505") {
            res.status(500).json({ error: "Email Already Exist!" });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
}); 

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User Not Found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Password" });
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

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.json({ token, user: payload.user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/verify-login", authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// ============ CANDIDATE PROFILE ROUTES ============
app.get("/candidate/profile", authenticateToken, async (req, res) => {
    const userId = req.user.user.id;
    try {
        const profile = await candidateProfileModel.findProfileByUserId(userId);
        res.send({ profile: profile });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/candidate/profile", async (req, res) => {
    const { formData, userId } = req.body;
    const { headline, bio, skills, experience, education, linkedin_url, portfolio_url, github_url } = formData;
    
    try {
        await candidateProfileModel.upsertProfile({
            headline, bio, skills, experience, education, linkedin_url, portfolio_url, github_url
        }, userId);
        res.send({ message: "Profile saved successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save profile" });
    }
});

// ============ COMPANY ROUTES ============
app.post("/addCompany", async (req, res) => {
    const { name, website, logo_url, description } = req.body.companyprofile;
    const userId = req.body.userId;

    try {
        const company = await companyModel.createCompany(name, description, website, logo_url, userId);
        res.send({ company: company });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/getCompanyDetails", async (req, res) => {
    const userId = req.body.userId;
    try {
        const company = await companyModel.findCompanyByUserId(userId);
        res.send({ company: company });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); 

app.put("/updateCompany", async (req, res) => {
    const { name, website, logo_url, description } = req.body.companyprofile;
    const userId = req.body.userId;
    
    try {
        const company = await companyModel.updateCompany(name, description, website, logo_url, userId);
        res.send({ company: company });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update company" });
    }
});

// ============ JOB ROUTES ============
app.post("/CreateNewJob", async (req, res) => {
    const { title, description, requirements, category, job_type, location, salary_range, expires_at } = req.body.jobDetails;
    const userId = req.body.userId;

    try {
        const company = await companyModel.findCompanyByUserId(userId);
        if(!company){
            console.log("hello");
            return res.status(401).send("Please fill company profile first");
        }
        
        const job = await jobModel.createJob({
            title, description, requirements, category, job_type, location, salary_range, expires_at
        }, userId);
        res.send("Success");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/getEmployerJobs", async (req, res) => {
    const userId = req.body.userId;
    try {
        const jobs = await jobModel.findJobsByEmployer(userId);
        res.send({ jobs: jobs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

app.post("/DeleteJob", async (req, res) => {
    const id = req.body.id;
    try {
        await jobModel.softDeleteJob(id);
        res.send("Successfull");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete job" });
    }
});

app.post("/EditJob", async (req, res) => {
    const { id, title, description, requirements, location, salary_range, job_type, category, expires_at } = req.body;
    
    try {
        await jobModel.updateJob({
            id, title, description, requirements, location, salary_range, job_type, category, expires_at
        });
        res.send("Successfull");
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed");
    }
});

app.get("/jobs", async (req, res) => {
    try {
        const jobs = await jobModel.findAllJobs();
        res.send({ jobs: jobs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

app.post("/getJobDetils", async (req, res) => {
    const id = req.body.id;
    try {
        const job = await jobModel.findJobById(id);
        res.send({ job: job });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch job details" });
    }
});

// ============ APPLICATION ROUTES ============
app.post("/postApplication", upload.single('resume'), async (req, res) => {
    const file = req.file;
    const { jobId, userId, phone_number, cover_letter, portfolio_link, linkedin_url, source } = req.body;

    try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFilename = `resume-${userId}-${jobId}-${uniqueSuffix}.pdf`;

        const application = await applicationModel.createApplication(
            { jobId, userId, phone_number, cover_letter, portfolio_link, linkedin_url, source },
            file.buffer,
            newFilename
        );

        const candidate = await userModel.findUserById(userId);
        const Job = await jobModel.findJobById(jobId);

        if (candidate) {
            await sendEmail( 
                candidate.email,
                "Application Submitted Successfully",
                `<p>Hi ${candidate.first_name} ${candidate.last_name},</p>
                 <p>Your application for Job ID <b>${jobId}</b> and Role <b> ${Job.title} </b> has been submitted successfully.</p>
                 <p> You can View Your application here <a href= "http://localhost:3000/candidate/dashboard/applications">View Applicaton </a></p>
                 <p>Thank you for applying!</p>`
            );
        }

        res.json({
            success: true,
            message: "Application submitted successfully",
            applicationId: application.id
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: "You have already applied for this job." });
        }
        console.error("Application submission error:", err);
        res.status(500).json({ error: 'Failed to submit application.' });
    }
});

app.post("/getEmployeerApplications", async (req, res) => {
    const jobId = req.body.jobId;
    try {
        const applications = await applicationModel.findApplicationsByJobId(jobId);
        const applicationsWithUrls = addResumeUrls(applications, req);
        res.json({ applications: applicationsWithUrls });
    } catch (err) {
        console.error("Error fetching employer applications:", err);
        res.status(500).json({ error: "Failed to fetch job applications." });
    }
});

app.get("/downloadResume/:applicationId", async (req, res) => {
    const { applicationId } = req.params;
    try {
        const application = await applicationModel.findApplicationById(applicationId);
        
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (!application.resume_file) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${application.resume_filename}"`);
        res.setHeader('Content-Length', application.resume_file.length);
        res.send(application.resume_file);

    } catch (err) {
        console.error("Resume view error:", err);
        res.status(500).json({ error: 'Failed to load resume' });
    }
});

app.put("/updateApplicationStatus", async (req, res) => {
    const { application_id, application_status } = req.body;
    try {
        await applicationModel.updateApplicationStatus(application_id, application_status);
        const application = await applicationModel.findApplicationById(application_id);
        const candidate = await userModel.findUserById(application.candidate_id);
        console.log(application)
        if (candidate) {
            const jobLink = `http://localhost:3000/candidate/dashboard/applications`;

            await sendEmail(
                candidate.email,
                "Application Status Updated",
                `
                <p>Hi ${candidate.first_name} ${candidate.last_name},</p>
                <p>Your application status has been updated to: <b>${application_status}</b>.</p>
                <p>You can view the details here: 
                    <a href="${jobLink}" target="_blank" style="background-color:#0ea5e9;color:white;padding:6px 12px;border-radius:5px;text-decoration:none;">View Application</a>
                </p>
                <p>Thank you!</p>
                `
            );
        }
        res.send("success");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update application status" });
    }
});

app.post("/getCandidateApplications", async (req, res) => {
    const userId = req.body.userId;
    try {
        const applications = await applicationModel.findApplicationsByCandidateId(userId);
        const applicationsWithUrls = addResumeUrls(applications, req);
        res.send({ applications: applicationsWithUrls });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});



app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});