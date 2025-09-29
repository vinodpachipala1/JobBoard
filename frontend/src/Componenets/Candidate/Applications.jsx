import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Path';

const Applications = () => {
    const { user } = useOutletContext();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (user) {
            const getApplications = async () => {
                try {
                    const res = await axios.post(`${BASE_URL}/getCandidateApplications`, { userId: user.id })
                    console.log(res.data.applications)
                    setApplications(res.data.applications || []);
                    setIsLoading(false);
                } catch (err) {
                    console.log(err);
                    setIsLoading(false);
                }
            }
            getApplications();
        }
    }, [user]);

    // Calculate stats from applications
    const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'Applied').length,
        reviewed: applications.filter(app => app.status === 'Reviewed').length,
        shortlisted: applications.filter(app => app.status === 'Shortlisted').length,
        rejected: applications.filter(app => app.status === 'Rejected').length,
        accepted: applications.filter(app => app.status === 'Accepted').length
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Pending': { label: '🟡 Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            'Reviewed': { label: '🔵 Reviewed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
            'Shortlisted': { label: '⭐ Shortlisted', color: 'bg-purple-100 text-purple-800 border-purple-200' },
            'Rejected': { label: '❌ Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
            'Accepted': { label: '✅ Accepted', color: 'bg-green-100 text-green-800 border-green-200' }
        };

        const config = statusConfig[status] || statusConfig['Pending'];
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const getStatusDisplay = (status) => {
        const statusDisplay = {
            'Pending': 'Pending',
            'Reviewed': 'Reviewed',
            'Shortlisted': 'Shortlisted',
            'Rejected': 'Rejected',
            'Accepted': 'Accepted'
        };
        return statusDisplay[status] || status;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const viewApplicationDetails = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
                <div className="text-sm text-gray-600">
                    {applications.length} {applications.length === 1 ? 'application' : 'applications'}
                </div>
            </div>

            {/* Stats Cards - Updated for new status options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-blue-800 font-medium">Total Applications</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-yellow-800 font-medium">Pending</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.shortlisted}</div>
                    <div className="text-sm text-purple-800 font-medium">Shortlisted</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                    <div className="text-sm text-green-800 font-medium">Accepted</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                    <div className="text-sm text-red-800 font-medium">Rejected</div>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here.</p>
                    <Link
                        to="/jobs"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Applications List */}
                    {applications.map((application) => (
                        <div key={application.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                {/* Job Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    <img
                                        src={application.company_logo}
                                        alt={application.company_name}
                                        className="w-12 h-12 rounded-lg object-cover border"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                                <Link to={`/jobs/${application.job_id}`}>
                                                    {application.job_title}
                                                </Link>
                                            </h3>
                                            {getStatusBadge(application.status)}
                                        </div>
                                        <p className="text-gray-700 font-medium">{application.company_name}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                                            <span>📍 {application.location}</span>
                                            <span>💰 {application.salary_range}</span>
                                            <span>🕒 {application.job_type}</span>
                                            <span>📅 Applied {formatDate(application.applied_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => viewApplicationDetails(application)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        View Details
                                    </button>
                                    <Link
                                        to={`/jobs/${application.job_id}`}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        View Job
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application Details Modal */}
            {/* Application Details Modal */}
            {showModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Job Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Job Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Job Title</label>
                                        <p className="font-medium">{selectedApplication.job_title}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Company</label>
                                        <p className="font-medium">{selectedApplication.company_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Location</label>
                                        <p className="font-medium">{selectedApplication.location}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Salary</label>
                                        <p className="font-medium">{selectedApplication.salary_range}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Job Type</label>
                                        <p className="font-medium">{selectedApplication.job_type}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Application Timeline */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Application Timeline</h4>
                                <div className="space-y-4">
                                    {/* Applied Date & Time */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-3 h-3 rounded-full mt-1 bg-green-500"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-green-700">Applied</span>
                                                <span className="text-sm text-gray-500">{formatDateTime(selectedApplication.applied_at)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Your application was submitted successfully</p>
                                        </div>
                                    </div>

                                    {/* Current Status */}
                                    <div className="flex items-start gap-4">
                                        <div className={`w-3 h-3 rounded-full mt-1 ${selectedApplication.status === 'Rejected' ? 'bg-red-500' :
                                                selectedApplication.status === 'Accepted' ? 'bg-green-500' :
                                                    selectedApplication.status === 'Shortlisted' ? 'bg-purple-500' :
                                                        selectedApplication.status === 'Reviewed' ? 'bg-blue-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium capitalize">
                                                    {getStatusDisplay(selectedApplication.status == "Applied" ? "Pending" : selectedApplication.status)}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {formatDateTime(selectedApplication.status_updated_at || selectedApplication.updated_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {selectedApplication.status === 'Applied' && 'Your application is under initial review'}
                                                {selectedApplication.status === 'Reviewed' && 'Your application has been reviewed by the employer'}
                                                {selectedApplication.status === 'Shortlisted' && 'Congratulations! You have been shortlisted for this position'}
                                                {selectedApplication.status === 'Accepted' && 'Congratulations! Your application has been accepted'}
                                                {selectedApplication.status === 'Rejected' && 'Your application was not selected for this position'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Your Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Phone Number</label>
                                        <p className="font-medium">{selectedApplication.phone_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Email</label>
                                        <p className="font-medium">{selectedApplication.candidate_email}</p>
                                    </div>
                                    {selectedApplication.linkedin_url && (
                                        <div>
                                            <label className="text-sm text-gray-600">LinkedIn</label>
                                            <p className="font-medium">
                                                <a href={selectedApplication.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    View Profile
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                    {selectedApplication.portfolio_link && (
                                        <div>
                                            <label className="text-sm text-gray-600">Portfolio</label>
                                            <p className="font-medium">
                                                <a href={selectedApplication.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    Visit Portfolio
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cover Letter */}
                            {selectedApplication.cover_letter && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Cover Letter</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                                    </div>
                                </div>
                            )}

                            {/* Resume */}
                            {selectedApplication.hasResume && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Resume</h4>
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium">{selectedApplication.resume_filename}</p>
                                            <a
                                                href={selectedApplication.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                View Resume
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Application Source */}
                            {selectedApplication.source && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Application Source</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700">How you heard about this position: <strong>{selectedApplication.source}</strong></p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <div className="flex justify-end gap-3">
                                <Link
                                    to={`/jobs/${selectedApplication.job_id}`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    View Job Posting
                                </Link>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;