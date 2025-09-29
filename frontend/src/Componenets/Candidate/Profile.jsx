import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Path';


const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const Profile = () => {
    const { user } = useOutletContext();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        headline: '',
        bio: '',
        skills: [],
        experience: [],
        education: [],
        linkedin_url: '',
        portfolio_url: '',
        github_url: ''
    });

    const [newSkill, setNewSkill] = useState('');
    const [newExperience, setNewExperience] = useState({ company: '', role: '', duration: '', description: '' });
    const [newEducation, setNewEducation] = useState({ degree: '', institute: '', startYear: '', endYear: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!user) return;
            setIsLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/candidate/profile`, { headers: { Authorization: `Bearer ${token}` } });
                const profileData = response.data.profile || {};
                const processedData = {
                    headline: profileData.headline || '',
                    bio: profileData.bio || '',
                    skills: Array.isArray(profileData.skills) ? profileData.skills : [],
                    experience: Array.isArray(profileData.experience) ? profileData.experience : [],
                    education: Array.isArray(profileData.education) ? profileData.education : [],
                    linkedin_url: profileData.linkedin_url || '',
                    portfolio_url: profileData.portfolio_url || '',
                    github_url: profileData.github_url || ''
                };
                setProfile(processedData);
                setFormData(processedData);
            } catch (error) {
                console.error('Error fetching profile:', error);
                const emptyProfile = { headline: '', bio: '', skills: [], experience: [], education: [], linkedin_url: '', portfolio_url: '', github_url: '' };
                setProfile(emptyProfile);
                setFormData(emptyProfile);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        if (newEducation.startYear && newEducation.endYear) addEducation(); // Add unsaved education
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${BASE_URL}/candidate/profile`, { formData, userId: user.id });
            setProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

    const addExperience = () => {
        if (newExperience.company && newExperience.role) {
            setFormData(prev => ({ ...prev, experience: [...prev.experience, { ...newExperience }] }));
            setNewExperience({ company: '', role: '', duration: '', description: '' });
        }
    };

    const removeExperience = (index) => setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));

    const addEducation = () => {
        if (newEducation.degree && newEducation.institute && newEducation.startYear && newEducation.endYear) {
            setFormData(prev => ({ ...prev, education: [...prev.education, { ...newEducation }] }));
            setNewEducation({ degree: '', institute: '', startYear: '', endYear: '' });
        } else {
            alert("Please fill all education fields (degree, institute, start year, end year).");
        }
    };

    const removeEducation = (index) => setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));

    if (isLoading) return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div></div>;

    return (
        <div className="space-y-8">

            {/* Profile Header */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-200 rounded-full flex items-center justify-center text-4xl font-bold text-sky-600">
                        {user?.fname?.charAt(0)}{user?.lname?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user?.fname} {user?.lname}</h1>
                        <p className="text-gray-600">{user?.email}</p>
                        {isEditing ? (
                            <input type="text" name="headline" value={formData.headline} onChange={handleInputChange} placeholder="Your Professional Headline" className="mt-2 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm" />
                        ) : (
                            <p className="text-lg text-sky-700 font-semibold mt-1">{profile?.headline || 'No headline added'}</p>
                        )}
                    </div>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium shadow-sm w-full sm:w-auto">
                        <EditIcon /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={handleCancel} className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-300">
                            <CancelIcon /> Cancel
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors text-sm font-medium shadow-sm">
                            {isSaving ? 'Saving...' : <><SaveIcon /> Save</>}
                        </button>
                    </div>
                )}
            </div>

            {/* Bio */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">About Me</h3>
                {isEditing ? (
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={5} placeholder="Tell us about yourself..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm" />
                ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{profile?.bio || <span className="text-gray-400">Your bio is empty. Click 'Edit Profile' to add one.</span>}</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Skills & Links */}
                <div className="lg:col-span-1 space-y-8">
                    
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Skills</h3>
                        {isEditing ? (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                                    <button onClick={addSkill} className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"><AddIcon /></button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.skills.map((skill, index) => (
                                        <span key={index} className="flex items-center gap-1.5 px-2 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-medium">
                                            {skill}<button onClick={() => removeSkill(skill)} type="button" className="font-bold">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {profile?.skills?.length > 0 ? profile.skills.map((skill, index) => <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{skill}</span>) : <span className="text-gray-400 text-sm">No skills added.</span>}
                            </div>
                        )}
                    </div>

                    
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Online Profiles</h3>
                        <div className="space-y-4">
                            {['linkedin_url', 'portfolio_url', 'github_url'].map(field => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-600 capitalize">{field.split('_')[0]}</label>
                                    {isEditing ? (
                                        <input type="url" name={field} value={formData[field]} onChange={handleInputChange} placeholder={`https://...`} className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                                    ) : (
                                        profile?.[field] ? <a href={profile[field]} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline break-all text-sm">{profile[field]}</a> : <span className="text-gray-400 text-sm">Not provided</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Experience & Education */}
                <div className="lg:col-span-2 space-y-8">
                   
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Work Experience</h3>
                        {isEditing ? (
                            <div className="space-y-4">
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{exp.role}</p>
                                            <p className="text-gray-700 text-sm">{exp.company}</p>
                                            {exp.duration && <p className="text-gray-500 text-xs">{exp.duration}</p>}
                                            {exp.description && <p className="text-gray-600 text-sm mt-1">{exp.description}</p>}
                                        </div>
                                        <button onClick={() => removeExperience(index)} type="button" className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><TrashIcon /></button>
                                    </div>
                                ))}
                                {/* Add new experience */}
                                <div className="p-4 bg-gray-50 rounded-lg border-t-2 border-sky-200">
                                    <h4 className="font-semibold text-sm mb-2">Add New Experience</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input type="text" placeholder="Company" value={newExperience.company} onChange={(e) => setNewExperience(p => ({ ...p, company: e.target.value }))} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                                        <input type="text" placeholder="Role" value={newExperience.role} onChange={(e) => setNewExperience(p => ({ ...p, role: e.target.value }))} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                                        <input type="text" placeholder="Duration (e.g., 2021 - Present)" value={newExperience.duration} onChange={(e) => setNewExperience(p => ({ ...p, duration: e.target.value }))} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm sm:col-span-2" />
                                        <textarea placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience(p => ({ ...p, description: e.target.value }))} rows={2} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm sm:col-span-2" />
                                        <button onClick={addExperience} disabled={!newExperience.company || !newExperience.role} className="sm:col-span-2 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-gray-400 text-sm font-medium">Add Experience</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {profile?.experience?.length > 0 ? profile.experience.map((exp, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <p className="font-semibold text-gray-900">{exp.role}</p>
                                        <p className="text-gray-700">{exp.company}</p>
                                        {exp.duration && <p className="text-gray-500 text-sm">{exp.duration}</p>}
                                        {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
                                    </div>
                                )) : <p className="text-gray-400 text-sm">No work experience added.</p>}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Education</h3>
                        {isEditing ? (
                            <div className="space-y-4">
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
                                            <p className="text-gray-700 text-sm">{edu.institute}</p>
                                            {edu.startYear && edu.endYear && <p className="text-gray-500 text-xs">{edu.startYear} - {edu.endYear}</p>}
                                        </div>
                                        <button onClick={() => removeEducation(index)} type="button" className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><TrashIcon /></button>
                                    </div>
                                ))}
                                <div className="p-4 bg-gray-50 rounded-lg border-t-2 border-green-200">
                                    <h4 className="font-semibold text-sm mb-2">Add New Education</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input type="text" placeholder="Degree" value={newEducation.degree} onChange={(e) => setNewEducation(p => ({ ...p, degree: e.target.value }))} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                                        <input type="text" placeholder="Institute" value={newEducation.institute} onChange={(e) => setNewEducation(p => ({ ...p, institute: e.target.value }))} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                                        <input type="text" placeholder="Start Year" value={newEducation.startYear} onChange={(e) => setNewEducation(p => ({ ...p, startYear: e.target.value }))} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                                        <input type="text" placeholder="End Year" value={newEducation.endYear} onChange={(e) => setNewEducation(p => ({ ...p, endYear: e.target.value }))} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                                        <button onClick={addEducation} disabled={!newEducation.degree || !newEducation.institute || !newEducation.startYear || !newEducation.endYear} className="sm:col-span-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm font-medium">Add Education</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {profile?.education?.length > 0 ? profile.education.map((edu, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <p className="font-semibold text-gray-900">{edu.degree}</p>
                                        <p className="text-gray-700">{edu.institute}</p>
                                        {edu.startYear && edu.endYear && <p className="text-gray-500 text-sm">{edu.startYear} - {edu.endYear}</p>}
                                    </div>
                                )) : <p className="text-gray-400 text-sm">No education information added.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
