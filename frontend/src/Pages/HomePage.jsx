import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Componenets/common/footer';
import axios from 'axios';
import BASE_URL from '../Componenets/Path';

const HomePage = () => {
    const navigate = useNavigate();
    const [loading, SetLoading] = useState(false);
    const [Jobs, SetJobs] = useState(null);
    const [searchQuery, setSearchQuery] = useState({
        title: '',
        location: ''
    });

    const featuredJobs = Jobs?.sort((a, b) => { 
        return new Date(b.created_at) - new Date(a.created_at) 
    }).slice(0, 6);

    useEffect(() => {
        const getJobs = async () => {
            SetLoading(true);
            try {
                const res = await axios.get(`${BASE_URL}/jobs`);
                SetJobs(res.data.jobs);
                SetLoading(false);
            }
            catch (err) {
                console.log(err);
                SetLoading(false);
            }
        }
        getJobs();
    }, []);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/jobs`, {state: {title : searchQuery.title.trim(), location : searchQuery.location.trim()}});
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="p-4 flex-1">
                {/* 1. Hero Section */}
                <section className="relative bg-[url('../public/home1.png')] bg-cover bg-center text-white">
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm"></div>
                    <div className="relative container mx-auto sm:pt-0 pt-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Connecting Talent with Opportunity
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
                            The premier platform for tech jobs in India. Your dream job is just a search away.
                        </p>
                        <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-2xl bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/20">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        name="title"
                                        value={searchQuery.title}
                                        onChange={handleSearchChange}
                                        placeholder="Job title or keyword" 
                                        className="w-full pl-10 pr-4 py-3 bg-transparent border-b border-white/50 text-white placeholder-gray-300 focus:outline-none focus:border-sky-400" 
                                    />
                                </div>
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        name="location"
                                        value={searchQuery.location}
                                        onChange={handleSearchChange}
                                        placeholder="Location" 
                                        className="w-full pl-10 pr-4 py-3 bg-transparent border-b border-white/50 text-white placeholder-gray-300 focus:outline-none focus:border-sky-400" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="px-6 py-3 bg-sky-600 rounded-md hover:bg-sky-700 text-white font-semibold transition-colors duration-300"
                                >
                                    Find Jobs
                                </button>
                            </div>
                        </form>
                        {/* Mobile Login/Register Buttons */}
                        <div className="md:hidden m-6 flex space-x-4">
                            <p onClick={() => navigate("/login")} className="px-6 py-2 text-sm font-semibold bg-gray-200/80 text-gray-800 rounded-md cursor-pointer">Login</p>
                            <p onClick={() => navigate("/register")} className="px-6 py-2 text-sm font-semibold bg-sky-600 text-white rounded-md cursor-pointer ">Register</p>
                        </div>
                    </div>
                </section>

                {/* Rest of your existing sections remain the same */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Featured Job Openings</h2>
                        {loading ? <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                        </div> :
                        featuredJobs && featuredJobs.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredJobs?.map(job => (
                                <div onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })} key={job.id} className="group block bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer">
                                    <div className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 rounded-full" />
                                            <div>
                                                <p className="text-gray-600 text-sm">{job.company}</p>
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">{job.title}</h3>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                                            <span>{job.location}</span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.job_type === 'Full-time' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{job.job_type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>) : (<div className="text-center text-gray-500 text-lg">No jobs available at the moment.</div>)}
                        <div className="text-center mt-12">
                            <p onClick={() => navigate("/jobs")} className="inline-block px-8 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 transition-colors cursor-pointer">View All Jobs</p>
                        </div>
                    </div>
                </section>

                {/* 3. "How It Works" Section */}
                <section className="bg-gray-100 py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-800">Get Started in Minutes</h2>
                        <p className="text-gray-600 mt-2">A straightforward path for candidates and employers.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-10 text-left">
                            {/* For Candidates Column */}
                            <div className="bg-white p-8 rounded-lg border border-gray-200">
                                <h3 className="text-2xl font-semibold text-gray-800">For Candidates</h3>
                                <ul className="mt-6 space-y-6">
                                    <li className="flex items-start"><div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-600 rounded-full font-bold">1</div><p className="ml-4 text-gray-600"><strong>Create Profile:</strong> Build a standout profile that showcases your skills and experience.</p></li>
                                    <li className="flex items-start"><div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-600 rounded-full font-bold">2</div><p className="ml-4 text-gray-600"><strong>Search Jobs:</strong> Find roles that match your criteria with our powerful search tools.</p></li>
                                    <li className="flex items-start"><div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-600 rounded-full font-bold">3</div><p className="ml-4 text-gray-600"><strong>Apply Directly:</strong> Apply to jobs with a single click and track your application status.</p></li>
                                </ul>
                            </div>
                            {/* For Employers Column */}
                            <div className="bg-white p-8 rounded-lg border border-gray-200">
                                <h3 className="text-2xl font-semibold text-gray-800">For Employers</h3>
                                <ul className="mt-6 space-y-6">
                                    <li className="flex items-start"><div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full font-bold">1</div><p className="ml-4 text-gray-600"><strong>Create Account:</strong> Sign up and create your company profile in minutes.</p></li>
                                    <li className="flex items-start"><div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full font-bold">2</div><p className="ml-4 text-gray-600"><strong>Post a Job:</strong> Easily post job openings and reach thousands of qualified candidates.</p></li>
                                    <li className="flex items-start"><div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full font-bold">3</div><p className="ml-4 text-gray-600"><strong>Hire Talent:</strong> Manage applicants and hire the perfect person for your team.</p></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Dual Call-to-Action (CTA) Banners */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Candidate CTA */}
                            <div className="relative bg-sky-50 p-8 rounded-lg text-center overflow-hidden">
                                <h3 className="text-2xl font-bold text-gray-800">Ready to find your next role?</h3>
                                <p className="mt-2 text-gray-600">Begin your search and take the next step in your professional journey.</p>
                                <button onClick={() => navigate("/jobs")} className="inline-flex items-center mt-6 px-6 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors">Start Your Career <span className="ml-2">→</span></button>
                            </div>
                            {/* Employer CTA */}
                            <div className="relative bg-gray-800 p-8 rounded-lg text-center text-white overflow-hidden">
                                <h3 className="text-2xl font-bold">Looking for your next great hire?</h3>
                                <p className="mt-2 text-gray-300">Reach top-tier candidates and build your dream team with us.</p>
                                <button onClick={() => navigate("/employer/dashboard")} className="inline-flex items-center mt-6 px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors">Post a Job Now <span className="ml-2">→</span></button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;