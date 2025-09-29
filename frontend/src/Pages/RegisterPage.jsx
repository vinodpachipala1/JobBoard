import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../Componenets/Path"
import { useNavigate } from "react-router-dom";
import { UserIcon, EnvelopeIcon, LockClosedIcon, BriefcaseIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const Register = () => {
    const navigate = useNavigate();

    const [regData, SetRegData] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    })

    const [errors, SetErrors] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [RegbtnLoading, SetButtonLoad] = useState(false);
    const [err, setErr] = useState("");
    
    // OTP verification states
    const [otp, setOtp] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [tempUserData, setTempUserData] = useState(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        SetRegData(prev => ({
            ...prev, [name]: value,
        }))

        SetErrors(prev => ({
            ...prev, [name]: "",
        }))

        setErr("");
    }

    // OTP input handler
    const handleOtpChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and limit to 6 digits
        if (/^\d*$/.test(value) && value.length <= 6) {
            setOtp(value);
        }
    };

    const verify = () => {
        var isValid = true;
        if (!/^[A-Za-z]{3,}$/.test(regData.fname)) {
            SetErrors(prev => ({ ...prev, fname: "First name must be at least 3 letters", }));
            isValid = false;
        }

        if (!/^[A-Za-z]{1,}$/.test(regData.lname)) {
            SetErrors(prev => ({ ...prev, lname: "Please Enter Last Name", }));
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email)) {
            SetErrors(prev => ({ ...prev, email: "Please enter a valid email address", }));
            isValid = false;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(regData.password)) {
            SetErrors(prev => ({ ...prev, password: "Password must be at least 8 characters long, with uppercase, lowercase, number, and special character", }));
            isValid = false;
        }

        if (regData.password !== regData.confirmPassword) {
            SetErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match", }));
            isValid = false;
        }

        if (!regData.role) {
            SetErrors(prev => ({ ...prev, role: "Role must be Selected", }));
            isValid = false;
        }
        return isValid;
    }

    const Register = async (e) => {
        e.preventDefault();
        if (verify()) {
            SetButtonLoad(true)
            try {
                const otpResponse = await axios.post(`${BASE_URL}/send-otp`, {
                    email: regData.email,
                    fname: regData.fname
                });
                
                SetButtonLoad(false);
                
                setTempUserData({...regData});
                setShowOtpModal(true);
                setErr("");
                setSuccessMessage("OTP sent successfully!");
                
                setResendCooldown(30);
                
            } catch (err) {
                SetButtonLoad(false);
                setErr(err.response?.data?.msg || "Failed to send OTP");
                console.log(err);
            }
        }
    }

    const verifyOtp = async () => {
        if (otp.length !== 6) {
            setErr("Please enter complete 6-digit OTP");
            return;
        }

        setOtpLoading(true);
        setErr("");
        setSuccessMessage("");
        try {
            const response = await axios.post(`${BASE_URL}/verify-otp`, {
                email: tempUserData.email,
                otp: otp
            });
            console.log(response.data.msg)
            if (response.data.msg === "OTP verified successfully") {
                setEmailVerified(true);
                
                const registerResponse = await axios.post(`${BASE_URL}/register`, tempUserData);
                
                setOtpLoading(false);
                setShowOtpModal(false);
                navigate("/login");
            }
        } catch (err) {
            setOtpLoading(false);
            setErr(err.response?.data?.error || "Invalid OTP");
            console.log(err);
        }
    };

    const resendOtp = async () => {
        if (resendCooldown > 0) return;
        
        setResendLoading(true);
        setErr("");
        setSuccessMessage("");
        try {
            await axios.post(`${BASE_URL}/send-otp`, {
                email: tempUserData.email,
                fname: tempUserData.fname
            });
            setSuccessMessage("New OTP sent successfully!");
            setOtp("");
            setResendLoading(false);
            
            
            setResendCooldown(30);
            
        } catch (err) {
            setResendLoading(false);
            setErr(err.response?.data?.error || "Failed to resend OTP");
        }
    };

    React.useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    return (
        <div className="min-h-screen bg-[url('../public/image.png')] bg-cover bg-center flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-2xl w-full max-w-sm p-4 rounded-xl shadow-lg border-t border-l border-white/20">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-extrabold text-white tracking-wide">Join Us!</h1>
                    <p className="text-gray-200 mt-1 text-base">Your next big opportunity awaits.</p>
                </div>

                <div className="sm:flex sm:space-x-4">
                    <div className="w-full mb-2 sm:mb-0">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-gray-300" /></div>
                            <input type="text" name="fname" placeholder="First Name" value={regData.fname} onChange={handleOnChange}
                                className="w-full pl-8 pr-3 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-sky-400 placeholder-gray-300 transition-colors duration-300"
                            />
                        </div>
                        {errors.fname && <p className="text-red-400 text-xs mt-1">{errors.fname}</p>}
                    </div>
                    <div className="w-full">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-gray-300" /></div>
                            <input type="text" name="lname" placeholder="Last Name" value={regData.lname} onChange={handleOnChange}
                                className="w-full pl-8 pr-3 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-sky-400 placeholder-gray-300 transition-colors duration-300"
                            />
                        </div>
                        {errors.lname && <p className="text-red-400 text-xs mt-1">{errors.lname}</p>}
                    </div>
                </div>

                <div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"><EnvelopeIcon className="h-5 w-5 text-gray-300" /></div>
                        <input type="email" name="email" placeholder="Email Address" value={regData.email} onChange={handleOnChange}
                            className="w-full pl-8 pr-3 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-sky-400 placeholder-gray-300 transition-colors duration-300"
                        />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-300" /></div>
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={regData.password} onChange={handleOnChange}
                            className="w-full pl-8 pr-10 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-sky-400 placeholder-gray-300 transition-colors duration-300"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-300 cursor-pointer" /> : <EyeIcon className="h-5 w-5 text-gray-300 cursor-pointer" />}
                            </button>
                        </div>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1" style={{ maxWidth: '280px' }}>{errors.password}</p>}
                </div>

                <div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-300" /></div>
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={regData.confirmPassword} onChange={handleOnChange}
                            className="w-full pl-8 pr-10 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-sky-400 placeholder-gray-300 transition-colors duration-300"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-300 cursor-pointer" /> : <EyeIcon className="h-5 w-5 text-gray-300 cursor-pointer" />}
                            </button>
                        </div>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"><BriefcaseIcon className="h-5 w-5 text-gray-300" /></div>
                        <select name="role" value={regData.role} onChange={handleOnChange}
                            className="w-full pl-8 pr-3 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-sky-400 cursor-pointer appearance-none"
                        >
                            <option value="" disabled className="text-gray-500">Select your role</option>
                            <option value="Candidate" className="text-black">Candidate</option>
                            <option value="Employer" className="text-black">Employer</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
                </div>

                {err && (<div className="w-full flex justify-center mt-2"> <span className="text-red-400 text-xs">{err}</span> </div>)}

                
                <button type="submit" disabled={RegbtnLoading} onClick={Register}  className="btn btn-primary w-full py-2 flex items-center justify-center mt-2 rounded-lg text-white bg-gradient-to-r from-teal-400 to-sky-600 hover:from-teal-500 hover:to-sky-700 text-base font-semibold transition-all duration-200"
                >
                    {RegbtnLoading ? (
                        <ArrowPathIcon className="animate-spin  h-5 w-5 text-white" />
                    ) : (
                        "Register"
                    )}
                </button>

                <p className="text-sm text-gray-200 text-center !mt-4">
                    Already have an account?
                    <a href="/login" className="text-teal-300 hover:text-teal-200 ml-1 font-semibold">Sign in</a>
                </p>

            </div>

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white/10 backdrop-blur-2xl w-full max-w-sm p-6 rounded-xl shadow-lg border-t border-l border-white/20">
                        <div className="text-center mb-6">
                            <CheckCircleIcon className="h-12 w-12 text-teal-400 mx-auto mb-2" />
                            <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
                            <p className="text-gray-200 mt-2">
                                We sent a 6-digit code to <br />
                                <span className="font-semibold text-teal-300">{tempUserData?.email}</span>
                            </p>
                        </div>

                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={handleOtpChange}
                                onFocus={e => e.target.select()}
                                className="w-full px-4 py-3 text-center text-white bg-transparent border-2 border-white/30 rounded-lg focus:border-teal-400 focus:outline-none text-lg font-semibold placeholder-gray-400"
                                maxLength={6}
                            />
                        </div>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="text-center mb-4">
                                <span className="text-green-400 text-sm">{successMessage}</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {err && (
                            <div className="text-center mb-4">
                                <span className="text-red-400 text-sm">{err}</span>
                            </div>
                        )}

                        <button
                            onClick={verifyOtp}
                            disabled={otpLoading}
                            className="btn btn-primary w-full py-2 flex items-center justify-center rounded-lg text-white bg-gradient-to-r from-teal-400 to-sky-600 hover:from-teal-500 hover:to-sky-700 text-base font-semibold transition-all duration-200 mb-3"
                        >
                            {otpLoading ? (
                                <ArrowPathIcon className="animate-spin h-5 w-5 text-white" />
                            ) : (
                                "Verify OTP"
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                onClick={resendOtp}
                                disabled={resendLoading || resendCooldown > 0}
                                className="text-teal-300 hover:text-teal-200 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {resendLoading ? (
                                    <span className="flex items-center justify-center">
                                        <ArrowPathIcon className="animate-spin h-4 w-4 mr-1" />
                                        Sending...
                                    </span>
                                ) : resendCooldown > 0 ? (
                                    `Resend OTP in ${resendCooldown}s`
                                ) : (
                                    "Resend OTP"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Register;