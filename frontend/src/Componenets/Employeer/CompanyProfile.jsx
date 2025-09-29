import React, { useState, useEffect } from 'react';
import BASE_URL from '../Path';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useOutletContext } from 'react-router-dom';

const CompanyProfile = (props) => {

    const {user} = useOutletContext();
    const [savedProfile, setSavedProfile] = useState(null);
    const [companyprofile, SetCompanyprofile] = useState({
        name:  "",
        description: "",
        website:  "",
        logo_url:  "",
    });
    const [error, SetError] = useState("");
    useEffect(() => {
        
        if (user) {
            const getData = async ()=>{
                try{
                    const res = await axios.post(`${BASE_URL}/getCompanyDetails`, { userId: user.id })
                    setSavedProfile(res.data.company);
                    SetCompanyprofile(res.data.company);
                } catch (err){
                    console.log(err);
                }
            }
            getData();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        SetCompanyprofile(prev => ({
            ...prev, [name]: value,
        }))
    }

    const [isEditing, SetisEditing] = useState(false);
    const [btnLoading, SetBtnLoading] = useState(false);


    const CreateProfile = async (e) => {
        e.preventDefault();
        SetBtnLoading(true);
        if(!companyprofile?.name || companyprofile?.name.trim() === ""){
            SetBtnLoading(false);
            SetError("Company Name is Required!");
            return;
        }
        try {
            const res = await axios.post(`${BASE_URL}/addCompany`, { companyprofile, userId: user.id });
            setSavedProfile(res.data.company)
            SetCompanyprofile(res.data.company);
            SetBtnLoading(false);
        } catch (err) {
            console.log(err);
            SetBtnLoading(false);
        }
    }

    const SaveChanges = async (e) => {
        e.preventDefault();
        SetBtnLoading(true);
        if(!companyprofile?.name || companyprofile?.name.trim() === ""){
            SetBtnLoading(false);
            SetError("Company Name is Required!");
            return;
        }
        try {
            const res = await axios.put(`${BASE_URL}/updateCompany`, { companyprofile, userId: user.id });
            setSavedProfile(res.data.company)
            SetisEditing(false);
            SetBtnLoading(false);

        } catch (err) {
            console.log(err);
            SetBtnLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">

            {(!savedProfile || isEditing)  ? (

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create Your Company Profile</h2>
                    <p className="mt-1 text-sm text-gray-600">You need to create a company profile before you can post jobs.</p>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">Company Name <span className="text-red-500">*</span></label>
                        <input type="text" name="name" onChange={handleChange} value={companyprofile?.name || ""} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <input type="url" name="website" onChange={handleChange} value={companyprofile?.website || ""} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="mt-6">
                        <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700">Logo URL</label>
                        <input type="url" name="logo_url" onChange={handleChange} value={companyprofile?.logo_url || ""} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="mt-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" onChange={handleChange} value={companyprofile?.description || ""} rows="4" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"></textarea>
                    </div >
                    {!savedProfile && <div className="text-right mt-6">
                        <button onClick={CreateProfile} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg w-[170px]">
                            <span className="flex items-center justify-center">{btnLoading ? (
                                <ArrowPathIcon className="animate-spin h-5 w-5 text-white" />
                            ) : (
                                "Create Profile"
                            )}</span> </button>
                    </div>}
                    {isEditing && <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 text-right mt-6">
                        <button type="button" className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors" onClick={() => SetisEditing(false)}>Cancel</button>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                            onClick={SaveChanges}
                        >
                            <span className="inline-flex items-center justify-center w-[110px]">
                                {btnLoading ? (
                                    <ArrowPathIcon className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    "Save Changes"
                                )}
                            </span>
                        </button>
                    </div>}
                    {error && <p className='text-red-400 text-center'>{error}</p>}

                </div>
            ) : (
                <div>

                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors w-full sm:w-auto justify-center" onClick={() => { SetisEditing(true) }}>
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                                Edit Profile
                            </button>
                        </div>
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
                                <img src={companyprofile.logo_url || "/placeholder-logo.png"} alt={`${companyprofile.name} Logo`} className="h-24 w-24 rounded-full object-cover border-2 border-gray-200 shadow-sm" />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm font-medium text-gray-600">Company Name</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">{companyprofile.name}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm font-medium text-gray-600">Website</p>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {companyprofile.website ? (
                                                <a href={companyprofile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                                                    {companyprofile.website}
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">N/A</span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm font-medium text-gray-600">Description</p>
                                        <p className="mt-1 text-sm text-gray-900 leading-relaxed">{companyprofile.description || <span className="text-gray-500">N/A</span>}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default CompanyProfile;