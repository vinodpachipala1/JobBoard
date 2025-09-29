import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../Path";
import { useNavigate, useLocation } from "react-router-dom";


const Header = () => {

    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            console.log("no token")
        }
        if (token) {
            const getUser = async () => {
                
                try {
                    const res = await axios.get(`${BASE_URL}/verify-login`, { headers: { Authorization: `Bearer ${token}` }, })
                    setUser(res.data.user.user)
                }
                catch (err) {
                    console.log(err)
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
            getUser();
        }
    }, [])

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const activeLinkStyle = "text-sky-400 font-bold underline decoration-sky-400 underline-offset-8";
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        window.location.href = "/";
    };

    return (
        <header className="bg-[url('../public/image.png')] bg-cover bg-center shadow-lg sticky top-0 z-50">
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        <div className="flex-shrink-0 text-3xl font-extrabold text-white tracking-wider">
                            JobBoard
                        </div>

                        <ul className="hidden md:flex items-center space-x-8">
                            <li onClick={() => navigate("/")} className={`cursor-pointer text-gray-200 hover:text-sky-400 transition-colors duration-300 ${location.pathname === "/" ? activeLinkStyle : ""}`}>Home</li>
                            <li onClick={() => navigate("/jobs")} className={`cursor-pointer text-gray-200 hover:text-sky-400 transition-colors duration-300 ${location.pathname === "/jobs" ? activeLinkStyle : ""
                                }`}>Job Listings</li>

                            {user?.role === 'Employer' && <li onClick={() => navigate("/employer/dashboard/")} className={`cursor-pointer text-gray-200 hover:text-sky-400 transition-colors duration-300 ${location.pathname.startsWith("/employer/dashboard") ? activeLinkStyle : ""
                                }`}>Employer Dashboard</li>}
                            {user?.role === 'Candidate' && <li onClick={() => navigate("/candidate/dashboard")} className={`cursor-pointer text-gray-200 hover:text-sky-400 transition-colors duration-300 ${location.pathname === "/candidate/dashboard" ? activeLinkStyle : ""
                                }`}>Candidate Dashboard</li>}
                        </ul>

                        
                        <div className="hidden md:flex items-center space-x-4">
                            {!user ? (
                                <>
                                    <p onClick={()=>navigate("/login")} className="px-4 py-2 text-gray-200 border border-gray-500 rounded-md hover:bg-gray-700 transition-colors duration-300 cursor-pointer">Login</p>
                                    <p onClick={()=>navigate("/register")} className="px-4 py-2 text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors duration-300 cursor-pointer">Register</p>
                                </>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                    >
                                        <img src={`https://placehold.co/40x40/60a5fa/ffffff?text=${user.fname.charAt(0).toUpperCase()}`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-500" />
                                        <span className="text-white font-medium">{user.fname + " " + user.lname}</span>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-700">
                                            <p onClick={()=>{navigate(user.role === "Employer" ? "/employer/dashboard" : "/candidate/dashboard")}} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer">Dashboard</p>
                                            
                                            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Logout</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button (Hamburger) */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-200 hover:text-white focus:outline-none">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {isMenuOpen && (
                        <div className="md:hidden pb-4">
                            <ul className="flex flex-col items-center space-y-4">
                                <li><span onClick={()=>navigate("/")}  className={`text-gray-200 hover:text-sky-400 ${location.pathname === "/" ? activeLinkStyle : ""}`}>Home</span></li>
                                <li><span onClick={()=>navigate("/jobs")} className={`text-gray-200 hover:text-sky-400 ${location.pathname === "/jobs" ? activeLinkStyle : ""}`}>Job Listings</span></li>
                                {!user ? (
                                    <>
                                        <li className="w-full"><span onClick={()=>navigate("/login")} className="block text-center w-full px-4 py-2 text-gray-200 border border-gray-500 rounded-md hover:bg-gray-700 ">Login</span></li>
                                        <li className="w-full"><span onClick={()=>navigate("/register")} className="block text-center w-full px-4 py-2 text-white bg-sky-600 rounded-md hover:bg-sky-700">Register</span></li>
                                    </>
                                ) : (
                                    <>
                                        <li className="border-t border-gray-700 w-full my-2"></li>
                                        <li><span onClick={()=>{navigate(user.role === "Employer" ? "/employer/dashboard" : "/candidate/dashboard")}} className="text-gray-200 hover:text-sky-400">Dashboard</span></li>
                                        <li className="w-full"><button onClick={handleLogout} className="block text-center w-full px-4 py-2 text-red-400 bg-gray-800 rounded-md hover:bg-gray-700">Logout</button></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;

