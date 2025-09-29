import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Componenets/Path';
import Footer from '../Componenets/common/footer';

const CandidateDashboard = () => {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState("profile");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please Login First");
            navigate("/");
        }
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get(`${BASE_URL}/verify-login`, { 
                        headers: { Authorization: `Bearer ${token}` } 
                    });
                    const userData = res.data.user.user;
                    if (userData.role !== "Candidate") {
                        alert("Please Login as Candidate");
                        navigate("/");
                    }
                    setUser(userData);
                } catch (err) {
                    console.log(err);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    alert("Please Login First");
                    navigate("/");
                }
            };
            getUser();
        }
    }, [navigate]);

    useEffect(() => {
        const path = location.pathname.split("/").pop();
        switch (path) {
            case "profile":
                setView("profile");
                break;
            case "applications":
                setView("applications");
                break;
            case "saved-jobs":
                setView("savedJobs");
                break;
            default:
                setView("profile");
        }
    }, [location.pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-gray-50 flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Candidate Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Sidebar Navigation - Exact same as employer dashboard */}
                        <aside className="md:col-span-3">
                            <nav className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <ul className="space-y-2">
                                    <li>
                                        <button 
                                            className={`w-full text-left flex items-center px-4 py-2 ${
                                                view === "profile" 
                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-md transition-colors" 
                                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                            }`} 
                                            onClick={() => { setView("profile"); navigate("profile"); }}
                                        >
                                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className={`w-full text-left flex items-center px-4 py-2 ${
                                                view === "applications" 
                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-md transition-colors" 
                                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                            }`} 
                                            onClick={() => { setView("applications"); navigate("applications"); }}
                                        >
                                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            My Applications
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </aside>

                        {/* Main Content Area - Exact same as employer dashboard */}
                        <main className="md:col-span-9 bg-white p-6 rounded-lg shadow border border-gray-200">
                            <Outlet context={{ user }} />
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CandidateDashboard;