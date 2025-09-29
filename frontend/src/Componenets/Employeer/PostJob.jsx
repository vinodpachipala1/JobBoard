import React, { useEffect, useState } from 'react';
import BASE_URL from '../Path';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';

const PostJob = () => {
    const navigate = useNavigate();
    const { user } = useOutletContext();
    const location = useLocation();
    const { job, type } = location.state || {};


    useEffect(() => {
        if (type === 'edit' && job) {
            SetJobDetails(job);
        }
    }, [job, type]);

    const initialJobDetails = {
        title: "",
        description: "",
        requirements: "",
        category: "",
        job_type: "",
        location: "",
        salary_range: "",
        expires_at: "",
    };

    const [errors, SetErrors] = useState({
        title: "",
        description: "",
        requirements: "",
        category: "",
        job_type: "",
        location: "",
        salary_range: "",
        expires_at: "",
    });

    const [jobDetails, SetJobDetails] = useState(initialJobDetails);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        SetJobDetails(prev => ({
            ...prev, [name]: value,
        }))
        SetErrors(prev => ({
            ...prev, [name]: "",
        }))
        SetErrMessage("");
        SetSuccessMessage("");
    }

    const [btnLoading, SetBtnLoading] = useState(false);
    const [successMessage, SetSuccessMessage] = useState("");
    const [errMessage, SetErrMessage] = useState("");

    const Verify = () => {
        let valid = true;
        const newErrors = {};

        if (!jobDetails.title.trim() || jobDetails.title.length < 3) {
            newErrors.title = "Title must be atleast 3 characters.";
            valid = false;
        }
        if (!jobDetails.description.trim() || jobDetails.description.length < 30) {
            newErrors.description = "Description should be at least 30 characters long.";
            valid = false;
        }
        if (!jobDetails.requirements.trim() || jobDetails.requirements.length < 20) {
            newErrors.requirements = "Requirements should be at least 20 characters long.";
            valid = false;
        }
        if (!jobDetails.category.trim()) {
            newErrors.category = "Please select a category";
            valid = false;
        }
        if (!jobDetails.job_type.trim()) {
            newErrors.job_type = "Please select a job type";
            valid = false;
        }
        if (!jobDetails.location.trim()) {
            newErrors.location = "Location is required.";
            valid = false;
        } else if (!/^[a-zA-Z\s,]+$/.test(jobDetails.location)) {
            newErrors.location = "Location should only contain letters, spaces, and commas.";
            valid = false;
        }
        if (!jobDetails.salary_range.trim()) {
            newErrors.salary_range = "Salary range is required";
            valid = false;
        }

        if (!jobDetails.expires_at) {
            newErrors.expires_at = "Application deadline is required.";
            valid = false;
        } else {
            const now = new Date();
            const deadline = new Date(jobDetails.expires_at);
            if (deadline <= now) {
                newErrors.expires_at = "Deadline must be a future date.";
                valid = false;
            }
        }

        SetErrors(newErrors);
        return valid;
    };


    const CreateJob = async (e) => {
        e.preventDefault();
        SetSuccessMessage("");
        SetErrMessage("");
        SetBtnLoading(true);
        console.log(user.id)
        if (!Verify()) {
            SetBtnLoading(false);
            return;
        }
        try {
            await axios.post(`${BASE_URL}/CreateNewJob`, { jobDetails, userId: user.id });
            SetSuccessMessage("Job Create Successfully");
            SetJobDetails(initialJobDetails);
            SetBtnLoading(false);
        } catch (err) {
            console.log(err);
            SetErrMessage(err.response.data);
            SetBtnLoading(false);
        }
    }

    const Edit = async (e) => {
        e.preventDefault();
        SetSuccessMessage("");
        SetErrMessage("");
        SetBtnLoading(true);
        console.log(jobDetails)
        if (!Verify()) {
            SetBtnLoading(false);
            return;
        }
        try {
            await axios.post(`${BASE_URL}/EditJob`, jobDetails);
            SetSuccessMessage("Job Edited Successfully");
            SetJobDetails(initialJobDetails);
            SetBtnLoading(false);

        } catch (err) {
            console.log(err)
            SetErrMessage("Internal Server Error")
            SetBtnLoading(false);
        }
    }



    return (
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg border border-gray-100 w-full max-w-6xl mx-auto">

            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-lg mb-8 border border-blue-100">
                {type === "edit" ? (
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Edit Job</h2>
                ) : (
                    <>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Post a New Job</h2>
                        <p className="mt-3 text-lg sm:text-xl text-gray-600">Fill out all the fields below to publish your job listing.</p>
                    </>
                )}
            </div>

            {/* SECTION 1: Job Details */}
            <div className="space-y-6 sm:space-y-8 border-b border-gray-200 pb-8 sm:pb-10">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Job Details</h3>
                </div>

                {/* Job Title */}
                <div>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">Job Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="title"
                        onChange={handleOnChange}
                        value={jobDetails.title}
                        className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    />
                    {errors.title && <span className="text-red-500 text-base mt-2 block">{errors.title}</span>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">Job Description <span className="text-red-500">*</span></label>
                    <textarea
                        name="description"
                        rows="6"
                        value={jobDetails.description}
                        onChange={handleOnChange}
                        className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Describe the role, responsibilities, and what a typical day looks like."
                        required
                    ></textarea>
                    {errors.description && <span className="text-red-500 text-base mt-2 block">{errors.description}</span>}
                </div>

                {/* Requirements */}
                <div>
                    <label htmlFor="requirements" className="block text-lg font-medium text-gray-700 mb-2">Requirements <span className="text-red-500">*</span></label>
                    <textarea
                        name="requirements"
                        rows="6"
                        value={jobDetails.requirements}
                        onChange={handleOnChange}
                        className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="List the skills, qualifications, and experience required. You can use bullet points."
                        required
                    ></textarea>
                    {errors.requirements && <span className="text-red-500 text-base mt-2 block">{errors.requirements}</span>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                        <select
                            name="category"
                            onChange={handleOnChange}
                            value={jobDetails.category}
                            className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            <option>All</option>
                            <option>Development</option>
                            <option>Design</option>
                            <option>Management</option>
                            <option>Marketing</option>
                            <option>Sales</option>
                            <option>Data Science</option>
                            <option>Customer Support</option>
                            <option>HR & Recruiting</option>
                        </select>
                        {errors.category && <span className="text-red-500 text-base mt-2 block">{errors.category}</span>}
                    </div>

                    {/* Job Type */}
                    <div>
                        <label htmlFor="job_type" className="block text-lg font-medium text-gray-700 mb-2">Job Type <span className="text-red-500">*</span></label>
                        <select
                            name="job_type"
                            onChange={handleOnChange}
                            value={jobDetails.job_type}
                            className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="" disabled>Select a type</option>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Remote</option>
                        </select>
                        {errors.job_type && <span className="text-red-500 text-base mt-2 block">{errors.job_type}</span>}
                    </div>
                </div>
            </div>

            {/* SECTION 2: Location & Salary */}
            <div className="space-y-6 sm:space-y-8 border-b border-gray-200 pb-8 sm:pb-10 mt-8">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Location & Salary</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            onChange={handleOnChange}
                            value={jobDetails.location}
                            name="location"
                            placeholder="e.g., Bengaluru, KA"
                            className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        />
                        {errors.location && <span className="text-red-500 text-base mt-2 block">{errors.location}</span>}
                    </div>

                    {/* Salary Range */}
                    <div>
                        <label htmlFor="salary_range" className="block text-lg font-medium text-gray-700 mb-2">Salary Range <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            onChange={handleOnChange}
                            value={jobDetails.salary_range}
                            id="salary_range"
                            name="salary_range"
                            placeholder="e.g., ₹12,00,000 - ₹15,00,000 PA"
                            className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        />
                        {errors.salary_range && <span className="text-red-500 text-base mt-2 block">{errors.salary_range}</span>}
                    </div>
                </div>
            </div>

            {/* SECTION 3: Dates */}
            <div className="mt-8">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Application Deadline</h3>
                </div>
                <div className="w-full lg:w-1/2">
                    <input
                        type="datetime-local"
                        onChange={handleOnChange}
                        value={jobDetails.expires_at}
                        name="expires_at"
                        className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    />
                    {errors.expires_at && <span className="text-red-500 text-base mt-2 block">{errors.expires_at}</span>}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row justify-end space-y-4 lg:space-y-0 lg:space-x-6 pt-8 mt-8">
                <button
                    type="button"
                    className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 text-lg"
                    onClick={() => navigate(type !== "edit" ? "/employer/dashboard" : "/employer/dashboard/manage-jobs")}
                >
                    Cancel
                </button>

                {type !== "edit" ? (
                    <button
                        onClick={CreateJob}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-lg"
                    >
                        <span className="inline-flex items-center justify-center w-[130px]">
                            {btnLoading ? (
                                <ArrowPathIcon className="animate-spin h-6 w-6 text-white" />
                            ) : (
                                "Post Job"
                            )}
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={Edit}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-lg"
                    >
                        <span className="inline-flex items-center justify-center w-[130px]">
                            {btnLoading ? (
                                <ArrowPathIcon className="animate-spin h-6 w-6 text-white" />
                            ) : (
                                "Update Job"
                            )}
                        </span>
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className='text-base mt-6 text-center'>
                {errMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg text-lg">
                        {errMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-6 py-4 rounded-lg text-lg">
                        {successMessage}
                    </div>
                )}
            </div>

        </div>
    );
};

export default PostJob;