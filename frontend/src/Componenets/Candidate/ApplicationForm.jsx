import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Path';
import Header from '../common/header';
import Footer from '../common/footer';

const ApplicationPage = () => {
    const location = useLocation();
    // Provide a default empty object for job to prevent crashes on initial render
    const { job = {}, user } = location.state || {};
    const navigate = useNavigate();

    // --- State Management ---
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        phone_number: '',
        cover_letter: '',
        portfolio_link: '',
        linkedin_url: '',
        source: ''
    });

    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [hasApplied, setHasApplied] = useState(false);

    // --- Constants ---

    const File_types = ['.pdf'];
    const Max_file_size = 1024 * 1024;

    // --- Effects ---
    useEffect(() => {
        checkExistingApplication();
    }, [job?.id]);

    const checkExistingApplication = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/applications/check/${job?.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHasApplied(response.data.hasApplied);
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    // --- Central Validation Function ---
    const validate = () => {
        const newErrors = {};
        var valid = true;

        // Required fields
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
            valid = false;
        } else if (!/^\+?[0-9\s-()]{7,20}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid phone number';
            valid = false;
        }

        if (!resumeFile) {
            newErrors.resume = 'Please upload your resume';
            valid = false;
        }

        if (!formData.source) {
            newErrors.source = "Please select how you heard about us";
            valid = false;
        }


        // Optional fields with validation rules
        if (formData.cover_letter.length > 2000) {
            newErrors.cover_letter = `Cover letter cannot exceed 2000 characters`;
            valid = false;
        }

        if (formData.portfolio_link && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.portfolio_link)) {
            newErrors.portfolio_link = 'Please enter a valid URL for your portfolio';
            valid = false;
        }
        if (formData.linkedin_url && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.linkedin_url)) {
            newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    // --- Event Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'cover_letter') setCharCount(value.length);
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (errors.resume) {
            setErrors(prev => ({ ...prev, resume: null }));
        }

        if (!file) {
            setResumeFile(null);
            setResumeFileName('');
            return;
        }

        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!File_types.includes(fileExtension)) {
            setErrors(prev => ({ ...prev, resume: `Invalid file type. Please upload ${File_types.join(', ')}.` }));
            e.target.value = '';
            return;
        }

        if (file.size > Max_file_size) {
            setErrors(prev => ({ ...prev, resume: 'File size must be less than 1MB.' }));
            e.target.value = '';
            return;
        }

        setResumeFile(file);
        setResumeFileName(file.name);
    };

    const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.classList.add('border-sky-400', 'bg-sky-50'); };
    const handleDragLeave = (e) => { e.preventDefault(); e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50'); };
    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-sky-400', 'bg-sky-50');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const input = document.getElementById('resume-upload');
            input.files = files;
            handleFileChange({ target: input });
        }
    };

    const Submit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        const submitData = new FormData();
        submitData.append('jobId', job.id);
        submitData.append('userId', user.id);
        submitData.append('resume', resumeFile);
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        try {
            // This is a placeholder for your actual API endpoint
            await axios.post(`${BASE_URL}/postApplication`, submitData );
            setSuccess(true);
        } catch (err) {
            setErrors({ form: "An unexpected error occurred. Please try again." });
            alert(err.response.data.error)
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <>
            <Header />

            {(!job || Object.keys(job).length === 0) ? (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading job details...</p>
                </div>
            </div>) : hasApplied ? (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Already Applied</h2>
                        <p className="text-gray-600 mb-6">You have already submitted an application for this position.</p>
                        <div className="space-y-3">
                            <button onClick={()=>navigate("/candidate/dashboard")} className="block w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
                                View Application Status
                            </button>
                            <button onClick={()=>navigate(`/jobs/${job?.id}`)} className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                                Back to Job Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>) :
                (<div className="min-h-screen bg-gray-50 py-8">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            {/* Header Section */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                                <button onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })} className="inline-flex items-center text-sm text-sky-600 hover:text-sky-700 hover:underline mb-4">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Back to Job Details
                                </button>
                                <h1 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h1>
                                <p className="text-gray-600 mt-1">
                                    at <span className="font-semibold">{job.company}</span> • {job.location}
                                </p>
                            </div>

                            {/* Success State */}
                            {success ? (
                                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted!</h2>
                                    <p className="text-gray-600 mb-6">Your application has been sent to {job.company_name || 'the employer'}. They will review it shortly.</p>
                                    <div className="space-y-3">
                                        <button onClick={()=>navigate("/candidate/dashboard")}  className="block w-full px-6 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors">
                                            View My Applications
                                        </button>
                                        <button onClick={()=>navigate("/jobs")} className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors">
                                            Browse More Jobs
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Application Form */
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    {errors.form && <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">{errors.form}</div>}
                                    <div>
                                        <div className="p-6 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                                {/* Resume Upload */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Resume <span className="text-red-500">*</span>
                                                    </label>
                                                    <div
                                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${errors.resume ? 'border-red-400 bg-red-50' : (resumeFileName ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400')}`}
                                                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => document.getElementById('resume-upload').click()}
                                                    >
                                                        <input id="resume-upload" name="resume" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                                        {resumeFileName ? (
                                                            <div className="space-y-2">
                                                                <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                <p className="text-green-600 font-semibold">{resumeFileName}</p>
                                                                <p className="text-sm text-gray-500">Click or drag to change file</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                                <div className="flex justify-center text-sm text-gray-600"><span className="relative cursor-pointer font-medium text-sky-600 hover:text-sky-500">Upload a file</span><p className="pl-1">or drag and drop</p></div>
                                                                <p className="text-xs text-gray-500">PDF up to 1MB</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
                                                </div>

                                                {/* Phone Number */}
                                                <div>
                                                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 ${errors.phone_number ? 'border-red-500' : 'border-gray-300'}`} required placeholder="+91 98765 43210" />
                                                    {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                                                </div>

                                                {/* Cover Letter */}
                                                <div className="md:col-span-2">
                                                    <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Cover Letter <span className="text-gray-500 font-normal">(Optional)</span>
                                                        <span className={`float-right text-xs ${charCount > 2000 ? 'text-red-500' : 'text-gray-500'}`}>
                                                            {charCount}/{2000}
                                                        </span>
                                                    </label>
                                                    <textarea id="cover_letter" name="cover_letter" rows={6} value={formData.cover_letter} onChange={handleInputChange} className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 ${errors.cover_letter ? 'border-red-500' : 'border-gray-300'}`} placeholder="Briefly introduce yourself..."></textarea>
                                                    {errors.cover_letter && <p className="text-red-500 text-sm mt-1">{errors.cover_letter}</p>}
                                                </div>

                                                {/* Portfolio Link */}
                                                <div>
                                                    <label htmlFor="portfolio_link" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Portfolio Link <span className="text-gray-500 font-normal">(Optional)</span>
                                                    </label>
                                                    <input type="url" id="portfolio_link" name="portfolio_link" value={formData.portfolio_link} onChange={handleInputChange} className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 ${errors.portfolio_link ? 'border-red-500' : 'border-gray-300'}`} placeholder="https://yourportfolio.com" />
                                                    {errors.portfolio_link && <p className="text-red-500 text-sm mt-1">{errors.portfolio_link}</p>}
                                                </div>

                                                {/* LinkedIn URL */}
                                                <div>
                                                    <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
                                                        LinkedIn Profile <span className="text-gray-500 font-normal">(Optional)</span>
                                                    </label>
                                                    <input type="url" id="linkedin_url" name="linkedin_url" value={formData.linkedin_url} onChange={handleInputChange} className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 ${errors.linkedin_url ? 'border-red-500' : 'border-gray-300'}`} placeholder="https://linkedin.com/in/yourname" />
                                                    {errors.linkedin_url && <p className="text-red-500 text-sm mt-1">{errors.linkedin_url}</p>}
                                                </div>

                                                {/* Source */}
                                                <div className="md:col-span-2">
                                                    <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                                                        How did you hear about us? <span className="text-red-500">*</span>
                                                    </label>
                                                    <select id="source" name="source" value={formData.source} onChange={handleInputChange}
                                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 ${errors.source ? "border-red-500" : "border-gray-300"
                                                            }`}
                                                        required
                                                    >
                                                        <option value="">-- Select an option --</option>
                                                        <option value="Website">Company Website</option>
                                                        <option value="LinkedIn">LinkedIn</option>
                                                        <option value="Referral">Employee Referral</option>
                                                        <option value="Job Board">Job Board</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source}</p>}
                                                </div>

                                            </div>

                                            {/* Submit Section */}
                                            <div className="pt-6 border-t border-gray-200">
                                                <button onClick={Submit} disabled={isLoading} className="w-full flex justify-center items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors">
                                                    {isLoading ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        "Submit Application"
                                                    )}
                                                </button>
                                                <p className="text-xs text-gray-500 text-center mt-3">
                                                    By submitting, you agree to our privacy policy and terms of service.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>)}
            <Footer />
        </>
    );
};

export default ApplicationPage;

