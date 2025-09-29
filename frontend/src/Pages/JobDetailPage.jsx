import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Componenets/common/footer';
import axios from 'axios';
import BASE_URL from '../Componenets/Path';
import { useLocation } from 'react-router-dom';
import ViewApplications from '../Componenets/Employeer/ViewApplicatons';
import Analytics from '../Componenets/Employeer/Analytics';

const JobDetailPage = () => {
    const location = useLocation();
    const { id } = useParams();
    const [job, SetJob] = useState({});
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    const [applications, setApplications] = useState([]);
    const [isApplying, setIsApplying] = useState(false);
    const [user, setUser] = useState();
    
    // Loading states
    const [loadingJob, setLoadingJob] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoadingUser(false);
            console.log("no token");
        }
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get(`${BASE_URL}/verify-login`, { headers: { Authorization: `Bearer ${token}` }, })
                    setUser(res.data.user.user);
                }
                catch (err) {
                    console.log(err);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                } finally {
                    setLoadingUser(false);
                }
            }
            getUser();
        } else {
            setLoadingUser(false);
        }
    }, [])

    useEffect(() => {
        const getJob = async () => {
            setLoadingJob(true);
            try {
                const res = await axios.post(`${BASE_URL}/getJobDetils`, { id })
                console.log(res.data.job)
                SetJob(res.data.job);
            }
            catch (err) {
                console.log(err);
            SetJob(null); // Set to null if job not found
            setLoadingJob(false);
            return; // Return early on error
            }
            setLoadingJob(false);
        }
        getJob();
    }, [id])

    useEffect(() => {
        if (job?.id) {
            const getData = async () => {
                setLoadingApplications(true);
                try {
                    const res = await axios.post(`${BASE_URL}/getEmployeerApplications`, { jobId: job.id });
                    setApplications(res.data.applications);
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoadingApplications(false);
                }
            }
            getData();
        }
    }, [job?.id]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Calculate days until expiration
    const getDaysUntilExpiry = (expiresAt) => {
        if (!expiresAt) return 0;
        const expiryDate = new Date(expiresAt);
        const today = new Date();
        const diffTime = expiryDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysUntilExpiry = job ? getDaysUntilExpiry(job?.expires_at) : 0;
    const isJobActive = daysUntilExpiry > 0;

    const Apply = () => {
        if (user?.id) {
            navigate(`/jobs/${job.id}/application`, { state: { job, user } });
            setIsApplying(true)
        }
        else {
            alert("please Login")
            navigate("/login")
        }
    }

    const updateApplicationStatus = async (application_id, application_status) => {
        console.log(application_id, application_status)
        try {
            await axios.put(`${BASE_URL}/updateApplicationStatus`, { application_id, application_status });
            const updatedApplications = applications.map(application => application.id === application_id ? { ...application, status: application_status } : application)
            setApplications(updatedApplications);
        } catch (err) {
            console.log(err);
        }
    }

    // Loading component
    const LoadingSkeleton = () => (
        <div className="flex flex-col min-h-screen">
            <div className='p-4 flex-1'>
                {/* Breadcrumb Loading */}
                <nav className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                    </div>
                </nav>

                <div className="flex-1 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Main Content Loading */}
                            <main className="lg:col-span-8 space-y-6">
                                {/* Job Header Card Loading */}
                                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                                <div className="flex-1">
                                                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                                    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="w-48 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Job Details Loading */}
                                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                                    <div className="space-y-4">
                                        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                        <div className="space-y-2">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </main>

                            {/* Sidebar Loading */}
                            <aside className="lg:col-span-4 space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4].map(j => (
                                                <div key={j} className="flex justify-between">
                                                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

    // Show loading while data is being fetched
    if (loadingJob || loadingUser || loadingApplications) {
        return <LoadingSkeleton />;
    }

    // Show not found if job doesn't exist
    if (!job) {
        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Job Details Not Found</h2>
                    <p className="text-gray-600">The job you are looking for might have been removed or does not exist.</p>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                        >
                            Go to Home
                        </button>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            View Jobs
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className='p-4 flex-1'>
                {/* Breadcrumb Navigation */}
                <nav className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <button onClick={() => navigate("/")} className="hover:text-sky-600 transition-colors">Home</button>
                            <span>›</span>
                            <button onClick={() => navigate("/jobs")} className="hover:text-sky-600 transition-colors">Jobs</button>
                            <span>›</span>
                            <span className="text-gray-900 font-medium truncate max-w-[200px]">{job.title}</span>
                        </div>
                    </div>
                </nav>

                <div className="flex-1 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* Main Content (Left Column) */}
                            <main className="lg:col-span-8 space-y-6">
                                {/* Job Header Card */}
                                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4 mb-4">
                                                <img
                                                    src={job.logo || 'https://placehold.co/80x80/3b82f6/ffffff?text=CO'}
                                                    alt={job.company}
                                                    className="w-16 h-16 rounded-lg object-cover border"
                                                />
                                                <div>
                                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                                    <p
                                                        className="text-lg text-sky-600 font-semibold hover:text-sky-700 transition-colors"
                                                    >
                                                        {job.company}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    📍 {job.location}
                                                </span>
                                                <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-medium">
                                                    {job.job_type}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    📅 Posted {formatDate(job.created_at)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    📅 Last Date {formatDate(job.expires_at)}
                                                </span>

                                                {job.category && (
                                                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                                                        {job.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            {user?.id === job.user_id ? (
                                                <div className="text-center p-3 bg-blue-50 text-blue-700 rounded-lg">
                                                    👑 You own this job posting
                                                </div>
                                            ) : (
                                                <>
                                                    {
                                                        applications.some(app => app.candidate_email === user?.email) ? (
                                                            <div className="px-4 py-3 bg-green-100 text-green-800 rounded-lg text-center font-medium">
                                                                ✓ Application Submitted
                                                            </div>
                                                        ) : (
                                                            <button onClick={Apply}
                                                                className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                                            >
                                                                {isApplying ? (
                                                                    <span className="flex items-center justify-center gap-2">
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                        Applying...
                                                                    </span>
                                                                ) : (
                                                                    'Apply Now'
                                                                )}
                                                            </button>
                                                        )
                                                    }
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Employer Tabs */}
                                    {user?.id === job.user_id && (
                                        <div className="border-b border-gray-200 mt-6">
                                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                                {[
                                                    { id: 'details', name: 'Job Details', icon: '📋' },
                                                    { id: 'applications', name: `Applications (${loadingApplications ? '...' : applications.length})`, icon: '👥' },
                                                    { id: 'analytics', name: 'Analytics', icon: '📊' }
                                                ].map(tab => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id
                                                            ? 'border-sky-500 text-sky-600'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <span>{tab.icon}</span>
                                                        {tab.name}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>
                                    )}
                                </div>

                                {/* Job Details Content */}
                                <div className={`bg-white rounded-xl shadow-lg p-6 sm:p-8 ${user?.id === job.user_id && activeTab !== 'details' ? 'hidden' : 'block'}`}>
                                    <div className="prose max-w-none">
                                        <section className="mb-8">
                                            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {job.description || 'No description provided.'}
                                            </p>
                                        </section>

                                        <section className="mb-8">
                                            <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements & Qualifications</h2>
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                                    {job.requirements || 'No specific requirements listed.'}
                                                </div>
                                            </div>
                                        </section>

                                        {job.responsibilities && (
                                            <section>
                                                <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                                                <div className="bg-gray-50 rounded-lg p-6">
                                                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                                        {job.responsibilities}
                                                    </div>
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>

                                {/* Applications Tab Content */}
                                {user?.id === job.user_id && activeTab === 'applications' && (
                                    loadingApplications ? (
                                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                                                <span className="ml-3 text-gray-600">Loading applications...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <ViewApplications applications={applications} formatDate={formatDate} updateApplicationStatus={updateApplicationStatus} />
                                    )
                                )}

                                {/* Analytics Tab Content */}
                                {user?.id === job.user_id && activeTab === 'analytics' && (
                                    <Analytics applications={applications} daysUntilExpiry={daysUntilExpiry} />
                                )}
                            </main>

                            {/* Sidebar (Right Column) */}
                            <aside className="lg:col-span-4 space-y-6">
                                {/* Job Summary Card */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">Job Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Salary Range</span>
                                            <span className="text-gray-900 font-semibold">{job.salary_range || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Employment Type</span>
                                            <span className="text-gray-900">{job.job_type || job.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Category</span>
                                            <span className="text-gray-900">{job.category || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Experience Level</span>
                                            <span className="text-gray-900">{job.experience_level || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Status</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isJobActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {isJobActive ? 'Active' : 'Expired'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Expires In</span>
                                            <span className="text-gray-900">
                                                {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Info Card */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">Company Information</h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={job?.logo || 'https://placehold.co/60x60/3b82f6/ffffff?text=CO'}
                                            alt={job?.company}
                                            className="w-16 h-16 rounded-lg object-cover border"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{job.company || job.company?.name}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {job?.company_description || 'Company information not available.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <a
                                            href={job?.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors text-sm"
                                        >
                                            🌐 Visit Website
                                        </a>
                                    </div>
                                </div>

                                {/* Share Job Card */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">Share This Job</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['LinkedIn', 'Twitter', 'Facebook', 'Email'].map(platform => (
                                            <button
                                                key={platform}
                                                className="py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                            >
                                                {platform}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobDetailPage;