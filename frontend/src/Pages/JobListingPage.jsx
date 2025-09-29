import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../Componenets/common/footer';
import axios from 'axios';
import BASE_URL from '../Componenets/Path';

// A placeholder component for the loading state
const JobCardSkeleton = () => (
    <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="flex items-center space-x-4">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
);

const JobListPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [displayedJobs, setDisplayedJobs] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const jobsPerLoad = 5;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("Newest");

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        jobType: "All",
        category: "All",
        location: ""
    });

    useEffect(() => {
        if(!location.state){
            return
        }
        const {title, location: locationFromState} = location.state; // Rename to avoid conflict
        const titleFromUrl = title || '';
        const locationFromUrl = locationFromState || '';

        if (titleFromUrl) {
            setSearchTerm(titleFromUrl);
        }
        if (locationFromUrl) {
            setFilters(prev => ({
                ...prev,
                location: locationFromUrl
            }));
        }
    }, [location.state]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const getJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${BASE_URL}/jobs`);
                const jobsData = res.data.jobs || [];
                setJobs(jobsData);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        getJobs();
    }, []);

    // Filter and search logic using useMemo for optimization
    const filteredAndSortedJobs = useMemo(() => {
        if (!jobs.length) return [];

        let filtered = jobs.filter(job => {
            // Search term filter (case insensitive)
            const matchesSearch = searchTerm === "" ||
                (job.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (job.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (job.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (job.location?.toLowerCase() || "").includes(searchTerm.toLowerCase());


            // Job type filter
            const matchesJobType = filters.jobType === "All" ||
                job.job_type === filters.jobType;

            // Category filter (assuming job has a category field)
            const matchesCategory = filters.category === "All" ||
                (job.category && job.category === filters.category);

            // Location filter
            const matchesLocation = filters.location === "" ||
                job.location.toLowerCase().includes(filters.location.toLowerCase());

            return matchesSearch && matchesJobType && matchesCategory && matchesLocation;
        });

        // Sort the filtered results
        return filtered.sort((a, b) => {
            if (sortBy === "Newest") {
                return new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === "Oldest") {
                return new Date(a.created_at) - new Date(b.created_at);
            } else {
                return new Date(a.expires_at) - new Date(b.expires_at);
            }
        });
    }, [jobs, searchTerm, filters, sortBy]);

    // Update displayed jobs when filters or visible count changes
    useEffect(() => {
        setDisplayedJobs(filteredAndSortedJobs.slice(0, visibleCount));
    }, [filteredAndSortedJobs, visibleCount]);

    const handleViewMore = () => {
        setVisibleCount(prevCount => prevCount + jobsPerLoad);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setVisibleCount(5); // Reset to first page when searching
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setVisibleCount(5); // Reset to first page when filtering
    };

    const handleApplyFilters = () => {
        // Filters are applied automatically through state changes
        setIsFilterOpen(false); // Close mobile filter panel
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setFilters({
            jobType: "All",
            category: "All",
            location: ""
        });
        setVisibleCount(5);
    };

    const canShowMore = filteredAndSortedJobs && displayedJobs.length < filteredAndSortedJobs.length;
    const activeFilterCount = (filters.jobType !== "All" ? 1 : 0) +
        (filters.category !== "All" ? 1 : 0) +
        (filters.location !== "" ? 1 : 0) +
        (searchTerm !== "" ? 1 : 0);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 bg-gray-50">
                {/* Hero Section with Search */}
                <div className="relative overflow-hidden bg-[url('../public/home1.png')] bg-cover bg-center m-4 text-white">
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm"></div>
                    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold">Explore Job Opportunities</h1>
                        <p className="mt-2 text-gray-300 text-base sm:text-lg">Find your next career move among thousands of openings.</p>
                        <div className="mt-6 max-w-2xl mx-auto relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by job title, keyword, or company..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
                        {/* Mobile Filter Overlay */}
                        {isFilterOpen && (
                            <div
                                onClick={() => setIsFilterOpen(false)}
                                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                                aria-hidden="true"
                            ></div>
                        )}

                        {/* Sidebar for Filters */}
                        <aside className={`transform transition-transform ease-in-out duration-300 lg:transform-none lg:transition-none ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:sticky lg:top-20 lg:col-span-3 inset-y-0 left-0 w-3/4 max-w-xs lg:w-full lg:max-w-none z-50 lg:z-40 lg:self-start`}>
                            <div className="bg-white p-4 rounded-r-lg lg:rounded-lg shadow h-full">
                                <div className="flex justify-between items-center lg:border-b lg:pb-2">
                                    <h3 className="text-lg font-semibold">Filter Jobs</h3>
                                    <button onClick={() => setIsFilterOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-800">
                                        <span className="sr-only">Close filters</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Active Filters Count */}
                                {activeFilterCount > 0 && (
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            {activeFilterCount} active filter(s)
                                        </span>
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-sm text-sky-600 hover:text-sky-800"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}

                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                                        <select
                                            value={filters.jobType}
                                            onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                            className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                        >
                                            <option value="All">All</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={filters.category}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                        >
                                            <option value="All">All</option>
                                            <option value="Development">Development</option>
                                            <option value="Design">Design</option>
                                            <option value="Management">Management</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="Customer Support">Customer Support</option>
                                            <option value="HR & Recruiting">HR & Recruiting</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="locationFilter" className="block text-sm font-medium text-gray-700">Location</label>
                                        <input
                                            type="text"
                                            value={filters.location}
                                            onChange={(e) => handleFilterChange('location', e.target.value)}
                                            placeholder="e.g., Bengaluru"
                                            className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyFilters}
                                        className="w-full px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content: Job Listings */}
                        <main className="lg:col-span-9">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 p-4 bg-white rounded-lg border">
                                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                                    {!isLoading && `Showing ${displayedJobs.length} of ${filteredAndSortedJobs.length} jobs`}
                                    {searchTerm && ` for "${searchTerm}"`}
                                </p>
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => setIsFilterOpen(true)} className="lg:hidden p-2 border rounded-md bg-white text-gray-600 flex items-center space-x-2">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-1.586l-3.707-3.707A1 1 0 019 12V6.414L3.293 4.707A1 1 0 013 4z" />
                                        </svg>
                                        <span>Filter</span>
                                        {activeFilterCount > 0 && (
                                            <span className="bg-sky-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor="sortOrder" className="text-sm font-medium text-gray-700">Sort by:</label>
                                        <select
                                            id="sortOrder"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="text-sm border-gray-300 rounded-md shadow-sm p-1 focus:border-sky-500 focus:ring-sky-500"
                                        >
                                            <option value="Newest">Newest</option>
                                            <option value="Oldest">Oldest</option>
                                            <option value="Expiring Soon">Expiring Soon</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters Display */}
                            {(searchTerm || filters.jobType !== "All" || filters.category !== "All" || filters.location) && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {searchTerm && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-sky-100 text-sky-800">
                                            Search: {searchTerm}
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="ml-2 hover:text-sky-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {filters.jobType !== "All" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                            Job Type: {filters.jobType}
                                            <button
                                                onClick={() => handleFilterChange('jobType', 'All')}
                                                className="ml-2 hover:text-green-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {filters.category !== "All" && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                            Category: {filters.category}
                                            <button
                                                onClick={() => handleFilterChange('category', 'All')}
                                                className="ml-2 hover:text-purple-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {filters.location && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                            Location: {filters.location}
                                            <button
                                                onClick={() => handleFilterChange('location', '')}
                                                className="ml-2 hover:text-orange-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-xs text-gray-600 hover:text-gray-800 underline"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => <JobCardSkeleton key={index} />)
                                ) : error ? (
                                    <div className="text-center py-10 bg-white rounded-lg shadow-sm border">
                                        <p className="text-red-500 font-semibold">{error}</p>
                                    </div>
                                ) : displayedJobs.length > 0 ? (
                                    displayedJobs.map(job => (
                                        <div key={job.id} className="bg-white p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300">
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <div>
                                                    <p onClick={() => navigate(`/jobs/${job.id}`)} className="text-xl font-semibold text-sky-600 hover:underline cursor-pointer">{job.title}</p>
                                                    <p className="text-md text-gray-800 font-medium mt-1">{job.company_name}</p>
                                                </div>
                                                <div className="mt-2 sm:mt-0">
                                                    <span className="bg-gray-100 px-3 py-1 text-sm font-semibold rounded-full text-gray-700">{job.job_type}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                                                <span>📍 {job.location}</span>
                                                <span>💰 {job.salary_range}</span>
                                                <span>📅 Posted: {new Date(job.created_at).toLocaleDateString('en-IN')}</span>
                                                <span>📅 Last Date: {new Date(job.expires_at).toLocaleDateString('en-IN')}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-4 line-clamp-2">{job.description}</p>
                                            <div className="text-right mt-4">
                                                <button
                                                    onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
                                                    className="inline-block px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-md hover:bg-gray-900 transition-colors"
                                                >
                                                    View Details
                                                </button> </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-white rounded-lg shadow-sm border">
                                        <p className="text-gray-500 font-semibold">
                                            {searchTerm || activeFilterCount > 0
                                                ? "No jobs found matching your criteria. Try adjusting your filters."
                                                : "No jobs found."
                                            }
                                        </p>
                                        {(searchTerm || activeFilterCount > 0) && (
                                            <button
                                                onClick={clearAllFilters}
                                                className="mt-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
                                            >
                                                Clear all filters
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* View More Button */}
                            {canShowMore && !isLoading && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={handleViewMore}
                                        className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                    >
                                        View More Jobs ({filteredAndSortedJobs.length - displayedJobs.length} remaining)
                                    </button>
                                </div>
                            )}

                            {filteredAndSortedJobs.length > 0 && displayedJobs.length >= filteredAndSortedJobs.length && !isLoading && (
                                <div className="mt-8 text-center">
                                    <p className="text-gray-600 font-medium">You've viewed all {filteredAndSortedJobs.length} jobs</p>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobListPage;