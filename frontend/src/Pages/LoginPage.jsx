import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../Componenets/Path';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const Login = () => {

    const navigate = useNavigate();

    const [log, SetLog] = useState({
        email: "",
        password: "",
    })

    const [errors, SetErrors] = useState({
        email: "",
        password: "",
    })

    const [err, setErr] = useState("");

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        SetLog(prev => ({
            ...prev, [name]: value,
        }))

        SetErrors(prev => ({
            ...prev, [name]: "",
        }))

        setErr("");
    }

    const [isbtnLoading, setBtnLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const verify = () => {
        var isValid = true;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(log.email)) {
            SetErrors(prev => ({ ...prev, email: "Please enter a valid email address", }));
            isValid = false;
        }
        return isValid;
    }

    const Login = async (e) => {
        e.preventDefault();
        
        if(verify()){
            setBtnLoading(true)
            try{
                const res = await axios.post(`${BASE_URL}/login`, log);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                const token = localStorage.getItem("token");
                if(token){
                    navigate("/");
                }
                setBtnLoading(false);
            } catch (err) {
                console.log(err.response.data);
                setErr(err.response.data.error);
                setBtnLoading(false);
            }
        }
    }

    return (

        <div className="min-h-screen bg-[url('../public/image.png')] bg-cover bg-center flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-3xl w-full max-w-sm p-4 rounded-xl shadow-lg border-t border-l border-white/20">

                <div className="text-center mb-4">
                    <h1 className="text-3xl font-extrabold text-white tracking-wide">Welcome Back!</h1>
                    <p className="text-gray-200 mt-1 text-base">Sign in to continue.</p>
                </div>


                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-300" />
                    </div>
                    <input type="email" name="email" placeholder="Email Address" value={log.email} onChange={handleOnChange}
                        className="w-full pl-8 pr-3 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-sky-400 placeholder-gray-300 transition-colors duration-300"
                        required
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-300" />
                    </div>
                    <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={log.password} onChange={handleOnChange}
                        className="w-full pl-8 pr-3 py-2 bg-transparent text-white border-b border-white/30 focus:outline-none focus:border-sky-400 placeholder-gray-300 transition-colors duration-300"
                        required
                    />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-300 cursor-pointer" /> : <EyeIcon className="h-5 w-5 text-gray-300 cursor-pointer" />}
                        </button>
                        
                    </div>
                </div>



                <button type="submit" disabled={isbtnLoading} onClick={Login} className="btn btn-primary w-full py-2 flex items-center justify-center mt-2 rounded-lg text-white bg-gradient-to-r from-teal-400 to-sky-600 hover:from-teal-500 hover:to-sky-700 text-base font-semibold transition-all duration-200"
                >
                    {isbtnLoading ? (
                        <ArrowPathIcon className="animate-spin  h-5 w-5 text-white" />
                    ) : (
                        "Login"
                    )}
                </button>
                {err && <p className="text-red-400 text-xs mt-1 text-center">{err}</p>}


                <p className="text-sm text-gray-200 text-center !mt-4">
                    Don't have an account?
                    <a href="/register" className="text-teal-300 hover:text-teal-200 ml-1 font-semibold">Sign up</a>
                </p>


            </div>

        </div>

    );

}



export default Login;