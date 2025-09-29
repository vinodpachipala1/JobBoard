import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import Register from "../Pages/RegisterPage";
import Login from "../Pages/LoginPage";
import EmployerDashboard from "../Pages/EmployerDashboard";
import ManageJobs from "../Componenets/Employeer/ManageJobs";
import PostJob from "../Componenets/Employeer/PostJob";
import CompanyProfile from "../Componenets/Employeer/CompanyProfile";
import JobListPage from "../Pages/JobListingPage";
import JobDetailPage from "../Pages/JobDetailPage";
import ApplicationPage from "../Componenets/Candidate/ApplicationForm";
import CandidateDashboard from "../Pages/CandidateDashboard";
import Profile from "../Componenets/Candidate/Profile";
import Applications from "../Componenets/Candidate/Applications";
const Router = () => {
    return (<BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/jobs/:id/application" element={<ApplicationPage />} />
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} >
                <Route index element={<Navigate to="profile" />} />
                <Route path="profile" element={<Profile />} />
                <Route path="applications" element={<Applications />} />
            </Route>

            <Route path='/employer/dashboard' element={<EmployerDashboard />}>
                <Route index element={<Navigate to="company-profile" />} /> {/* default */}
                <Route path="company-profile" element={<CompanyProfile />} />
                <Route path="post-job" element={<PostJob />} />
                <Route path="manage-jobs" element={<ManageJobs />} />
            </Route>

        </Routes>
    </BrowserRouter>)
}

export default Router;
