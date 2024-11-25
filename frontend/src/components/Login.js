import React, { useState, useContext } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { ToastContext } from '../context/ToastContextProvider'; 
import "../css/Login.css"
import buildingImage from '../pic/building.png';

const Login = () => {
    const [data, setData] = useState({
        memId: "",
        password: "",    
    });
    const { toast } = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const APICALL = async () => {
        try {
            const res = await axios.post('http://localhost:3003/login', {
                memId: data.memId,
                password: data.password,
            });

            localStorage.setItem('memId', res.data.memId);
            localStorage.setItem('role', res.data.role);
            toast.success("Login Successful");

            if (res.data.role === 'Admin') {
                navigate("/admins");
            } else if (res.data.role === 'Member' || 'Staff') {
                navigate("/members");
            } else {
                console.error("Unknown user role:", res.data.role);
                navigate("/");
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        APICALL();
    };

    const handleForgotPassword = () => {
        toast.info("Forgot password feature coming soon!");
        // Optionally navigate to a password recovery page
        // navigate("/forgot-password");
    };

    return (
        <div className="login-form-container">
            <div className="login-form-card">
                <div className="login-form-left">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group1">
                            <input 
                                type="text" 
                                name="memId" 
                                placeholder="Member ID" 
                                value={data.memId} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="input-group1">
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password" 
                                value={data.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "Logging in..." : "LOGIN"}
                        </button>
                        <a href="#" className="forgot-password">Forgot password?</a>

                    </form>
                    <p>Don’t have an account? <a href="#" onClick={() => navigate("/register")}>Sign up</a></p>
                </div>

                <div className="contact-info">

                    <img src={buildingImage} alt="Building" className="login-image" />
                    <div className="overlay">
                        <p>Head Office: Gregorio T. Lluch St, Iligan City, 9200, Philippines<br />
                           Phone: (063) 222-5574 <br />
                           Email: msuiitmpc@msuiitcoop.org</p>
                        <button className="learn-more-btn">Learn More</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;