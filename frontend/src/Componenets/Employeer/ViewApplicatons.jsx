
const ViewApplications = (props) => {
    const applications = props.applications;
    const formatDate = props.formatDate;

    return (<>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Candidate Applications</h3>
                        <p className="text-sm text-gray-600 mt-1">Manage and review all applications for this position</p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-sky-600 border border-sky-200">
                            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {applications.length > 0 ? (
                    <div className="space-y-4">

                        {/* Applications List */}
                        <div className="space-y-4">
                            {applications.map(application => (
                                <div key={application.id} className="group border border-gray-200 rounded-xl p-5 hover:border-sky-300 hover:shadow-lg transition-all duration-300 bg-white">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                                        {/* Candidate Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                                    <span className="text-2xl font-bold text-sky-600">
                                                        {application.candidate_fname?.charAt(0) || application.candidateName?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                                    <div className={`w-4 h-4 rounded-full border border-white ${application.status === 'accepted' ? 'bg-green-500' :
                                                            application.status === 'rejected' ? 'bg-red-500' :
                                                                application.status === 'shortlisted' ? 'bg-blue-500' :
                                                                    application.status === 'reviewed' ? 'bg-yellow-500' : 'bg-gray-400'
                                                        }`}></div>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <h4 className="font-bold text-gray-900 text-lg">
                                                        {application.candidate_fname + " " + application.candidate_lname}
                                                    </h4>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${application.status === 'Accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                            application.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                                application.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                                    application.status === 'Reviewed' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                                                        'bg-gray-100 text-gray-800 border border-gray-200'
                                                        }`}>
                                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm truncate">{application.candidate_email}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-gray-500">
                                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-xs">Applied {formatDate(application.applied_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-3 min-w-[280px]">
                                            <select onChange={(e)=>props.updateApplicationStatus(application.id, e.target.value)}
                                                value={application.status}
                                                className="text-sm border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white shadow-sm"
                                            >
                                                
                                                <option value="Applied">🟡 Pending</option>
                                                <option value="Reviewed">🔵 Reviewed</option>
                                                <option value="Shortlisted">⭐ Shortlisted</option>
                                                <option value="Rejected">❌ Rejected</option>
                                                <option value="Accepted">✅ Accepted</option>
                                            </select>

                                            <div className="flex gap-2">
                                                <a
                                                    href={application.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors border border-gray-200 flex-1 justify-center"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Resume
                                                </a>
                                                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg text-sm font-semibold hover:from-sky-600 hover:to-blue-600 transition-all shadow-sm hover:shadow flex-1 justify-center">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    Contact
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cover Letter */}
                                    {(application.cover_letter || application.coverLetter) && (
                                        <div className="mt-5 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                            <div className="flex items-center gap-2 mb-3">
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-sm font-semibold text-gray-700">Cover Letter</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                                {application.cover_letter || application.coverLetter}
                                            </p>
                                            <button className="mt-2 text-sky-600 text-xs font-semibold hover:text-sky-700 transition-colors flex items-center gap-1">
                                                Read full letter
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Quick Info */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Updated: {formatDate(application.updated_at)}</span>
                                        </div>

                                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📭</span>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">No applications yet</h4>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            Applications will appear here when candidates start applying for this position.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-gray-600">
                                💡 <strong>Tip:</strong> Share your job posting to attract more candidates
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>)
}
export default ViewApplications;