import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Componenets/Path';
import Header from '../Componenets/common/header';
import Footer from '../Componenets/common/footer';

const EmployerDashboard = () => {

    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const [view, SetView] = useState("companyProfile");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Pleas Login First");
            navigate("/");
        }
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get(`${BASE_URL}/verify-login`, { headers: { Authorization: `Bearer ${token}` }, })
                    const userData = res.data.user.user;
                    if (userData.role !== "Employer") {
                        alert("Please Login")
                        navigate("/")
                    }
                    setUser(userData)
                }
                catch (err) {
                    console.log(err)
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    alert("Pleas Login First");
                    navigate("/")
                }
            }
            getUser();
        }
    }, [navigate])

    useEffect(() => {
        const path = location.pathname.split("/").pop();
        switch (path) {
            case "company-profile":
                SetView("companyProfile");
                break;
            case "post-job":
                SetView("PostJob");
                break;
            case "manage-jobs":
                SetView("ManageJobs");
                break;
            default:
                SetView("companyProfile");
        }
    }, [location.pathname]);


    return (
        <div className="flex flex-col min-h-screen">

            <Header />
            <div className="bg-gray-50 flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Employer Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                        <aside className="md:col-span-3">
                            <nav className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <ul className="space-y-2">

                                    <li><button className={`w-full text-left flex items-center px-4 py-2 ${view === "companyProfile" ? `bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-md transition-colors` : `text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors`}`} onClick={() => { SetView("companyProfile"); navigate("company-profile") }}>
                                        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>Company Profile</button>
                                    </li>
                                    <li><button className={`w-full text-left flex items-center px-4 py-2 ${view === "PostJob" ? `bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-md transition-colors` : `text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors`}`} onClick={() => { SetView("PostJob"); navigate("post-job") }}>
                                        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Post New Job</button>
                                    </li>
                                    <li><button className={`w-full text-left flex items-center px-4 py-2 ${view === "ManageJobs" ? `bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-md transition-colors` : `text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors`}`} onClick={() => { SetView("ManageJobs"); navigate("manage-jobs") }}>
                                        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>Manage Jobs</button>
                                    </li>
                                </ul>
                            </nav>
                        </aside>


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

export default EmployerDashboard;