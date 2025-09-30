const Analytics = (props) => {
    const applications = props.applications;
    const daysUntilExpiry = props.daysUntilExpiry;
    
    return (<>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Job Analytics</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Track performance and engagement</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                        <span className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-sky-600 border border-sky-200">
                            {applications.length} total
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {/* Main Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-blue-600 bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </span>
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1">{applications.length}</div>
                        <div className="text-xs sm:text-sm font-semibold text-blue-800">Total</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-green-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-green-600 bg-green-100 p-1.5 sm:p-2 rounded-lg">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-1">
                            {applications.filter(app => app.status === 'Reviewed').length}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-green-800">Reviewed</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-purple-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-purple-600 bg-purple-100 p-1.5 sm:p-2 rounded-lg">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </span>
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-1">
                            {applications.filter(app => app.status === 'Shortlisted').length}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-purple-800">Shortlisted</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-orange-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-orange-600 bg-orange-100 p-1.5 sm:p-2 rounded-lg">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mb-1">
                            {daysUntilExpiry}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-orange-800">Days Left</div>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Application Status</h4>
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                { status: 'Pending', label: 'Pending', color: 'bg-gray-400', count: applications.filter(app => app.status === 'Applied' || app.status === 'Penidng').length },
                                { status: 'Reviewed', label: 'Reviewed', color: 'bg-yellow-500', count: applications.filter(app => app.status === 'Reviewed').length },
                                { status: 'Shortlisted', label: 'Shortlisted', color: 'bg-blue-500', count: applications.filter(app => app.status === 'Shortlisted').length },
                                { status: 'Rejected', label: 'Rejected', color: 'bg-red-500', count: applications.filter(app => app.status === 'Rejected').length },
                                { status: 'Accepted', label: 'Accepted', color: 'bg-green-500', count: applications.filter(app => app.status === 'Accepted').length }
                            ].map((item, index) => {
                                const percentage = applications.length > 0 ? (item.count / applications.length) * 100 : 0;
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${item.color}`}></div>
                                            <span className="text-xs sm:text-sm font-medium text-gray-700">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-16 sm:w-20 md:w-24 bg-gray-200 rounded-full h-1.5 sm:h-2">
                                                <div
                                                    className={`h-1.5 sm:h-2 rounded-full ${item.color} transition-all duration-500`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs sm:text-sm font-semibold text-gray-900 w-6 sm:w-8 text-right">
                                                {item.count}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default Analytics;