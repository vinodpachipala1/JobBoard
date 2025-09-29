import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import BASE_URL from '../Path';
import axios from 'axios';

const ManageJobs = (props) => {
    const { user } = useOutletContext();
    const [jobs, SetJobs] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const getData = async () => {
                try {
                    const res = await axios.post(`${BASE_URL}/getEmployerJobs`, { userId: user.id });
                    SetJobs(res.data.jobs);
                }
                catch (err) {
                    console.log(err);
                }
            }
            getData();
        }
    }, [user])

    const [sortBy, setSoryBy] = useState("Newest");
    const [statusFilter, SetStausFilter] = useState("All")
    const [searchQuery, setSearchQuery] = useState("");
    const [successMessage, SetSuccessMessage] = useState("");

    const FilteredJobs = jobs?.filter((job) => {
        // Status filter
        if (statusFilter === "Active" && new Date(job.expires_at) <= new Date()) return false;
        if (statusFilter === "Expired" && new Date(job.expires_at) > new Date()) return false;

        // Search filter
        if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        return true; // job passes both filters
    }) || [];

    const SortedJobs = [...FilteredJobs]?.sort((a, b) => {
        if (sortBy === "Newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "Oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else {
            return new Date(a.expires_at) - new Date(b.expires_at);
        }
    });

    const Delete = async (id) => {
        try {
            await axios.post(`${BASE_URL}/DeleteJob`, { id })
            SetSuccessMessage("Deleted Successfully");
            setTimeout(() => {
                SetSuccessMessage("");
            }, 1000);
            const updatedJobs = jobs.map(job => job.id === id ? { ...job, is_deleted: true } : job);
            SetJobs(updatedJobs);
        } catch (err) {
            console.log(err);
        }
    }

    const [visibleJobs, setVisibleJobs] = useState(5);
    const jobsPerLoad = 5;
    const currentJobs = SortedJobs?.slice(0, visibleJobs);

    const loadMoreJobs = () => {
        setVisibleJobs(prev => prev + jobsPerLoad);
    };

    const stats = {
        total: jobs?.length || 0,
        active: jobs?.filter(job => new Date(job.expires_at) > new Date())?.length || 0,
        expired: jobs?.filter(job => new Date(job.expires_at) <= new Date())?.length || 0,
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            {successMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg pointer-events-auto animate-fade-in-out">
                        {successMessage}
                    </div>
                </div>
            )}
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Your Jobs</h2>
                <p onClick={() => navigate("/employer/dashboard/post-job")} className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-md hover:from-sky-700 hover:to-blue-700 transition-colors cursor-pointer">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Post New Job
                </p>
            </div>

            {jobs?.length === 0 ? (
                // --- Empty State ---
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-semibold text-gray-700">You haven't posted any jobs yet.</h3>
                    <p className="mt-2 text-gray-500">Get started by posting your first job opening to find the perfect candidate.</p>
                    <p onClick={() => navigate("/employer/dashboard/post-job")} className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-md hover:from-sky-700 hover:to-blue-700 transition-colors cursor-pointer">
                        Post Your First Job
                    </p>
                </div>
            ) : (
                // --- Main View when jobs exist ---
                <div>
                    {/* Quick Stats Widget */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                            <p className="text-sm text-blue-800 font-medium">Total Jobs Posted</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            <p className="text-sm text-green-800 font-medium">Active Jobs</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200 text-center">
                            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                            <p className="text-sm text-red-800 font-medium">Expired Jobs</p>
                        </div>
                    </div>

                    {/* Search, Filters & Sorting */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 p-4 bg-gray-50 rounded-lg border">
                        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by job title..."
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <div className="flex items-center space-x-2">
                                <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">Filter by:</label>
                                <select id="statusFilter" onChange={(e) => SetStausFilter(e.target.value)} className="text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500">
                                    <option>All</option>
                                    <option>Active</option>
                                    <option>Expired</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                <label htmlFor="sortOrder" className="text-sm font-medium text-gray-700">Sort by:</label>
                                <select id="sortOrder" name={sortBy} onChange={(e) => setSoryBy(e.target.value)} className="text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500">
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                    <option>Expiring Soon</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Job Listings Section */}
                    <div className="space-y-4">
                        {currentJobs?.map(job => (
                            <div key={job.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                        <button onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}  className="text-lg font-semibold text-sky-600 hover:underline">
                                            {job.title}
                                        </button>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                                            <span>{job.location}</span>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                {job.job_type}
                                            </span>
                                            <span>{job.salary_range}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 sm:mt-0 flex-shrink-0">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            job.is_deleted ? 'bg-gray-300 text-gray-700' :
                                            new Date(job.expires_at) > new Date() ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                                        }`}>
                                            {job.is_deleted ? 'Deleted' : new Date(job.expires_at) > new Date() ? 'Active' : 'Expired'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:gap-x-4 text-xs text-gray-400">
                                        <p>
                                            Created: {new Date(job.created_at).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <p>
                                            Expires: {new Date(job.expires_at).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    {/* Job Actions */}

                                    {!job.is_deleted && <div className="flex space-x-2 mt-4 sm:mt-0">
                                        <button
                                            className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                            onClick={() => navigate("/employer/dashboard/post-job", { state: { job, type: 'edit' } })}
                                        >
                                            Edit
                                        </button>

                                        <button 
                                            className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors" 
                                            onClick={() => { Delete(job.id) }}
                                        >
                                            Delete
                                        </button>
                                    </div>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Show More Button */}
                    {visibleJobs < SortedJobs.length && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={loadMoreJobs}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 hover:shadow-xl"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                                Load More Jobs
                                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                                    {SortedJobs.length - visibleJobs} remaining
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageJobs;