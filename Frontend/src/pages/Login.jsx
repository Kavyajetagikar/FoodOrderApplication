import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCustomer } from "../context/CustomerContext";
import { showToast } from "../components/Toast";
import { getCustomerByEmail } from "../api/customerApi";

function Login() {
    const navigate = useNavigate();
    const { loginCustomer, loginAsDemoUser, loginAsDemoManager } = useCustomer();

    const [formData, setFormData] = useState({
        email: "alex.morgan@foodie.com",
        password: "password123"
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim() || !formData.email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        if (!formData.password.trim()) {
            setError("Please enter your password");
            return;
        }

        setLoading(true);

        try {
            const response = await getCustomerByEmail(formData.email.trim());

            if (response.data?.data) {
                const customerData = response.data.data;
                loginCustomer({
                    ...customerData,
                    phone: String(customerData.contact || customerData.phone || "9876543210")
                });
                showToast(`Welcome back, ${customerData.customerName || "Foodie"}!`, "success");
                navigate("/restaurants");
                return;
            }
        } catch (err) {
            console.log("Customer email lookup:", err.message);
        }

        // Fallback login for offline/demo use
        loginCustomer({
            customerId: Math.floor(100 + Math.random() * 900),
            customerName: formData.email.split("@")[0].replace(".", " ").toUpperCase(),
            email: formData.email,
            phone: "9876543210",
            address: "Flat 402, Sunshine Heights, MG Road"
        });

        navigate("/restaurants");
        setLoading(false);
    };

    const handleDemoUser = () => {
        loginAsDemoUser();
        navigate("/restaurants");
    };

    const handleDemoManager = () => {
        loginAsDemoManager();
        navigate("/restaurants");
    };

    return (
        <div className="auth-page-wrapper">
            <Navbar />

            <main className="page-container auth-layout">
                <div className="auth-card-container">
                    {/* LEFT PROMO BANNER */}
                    <div className="auth-side-banner">
                        <div className="banner-content">
                            <span className="banner-hero-icon">🍔</span>
                            <h2>Welcome Back to Foodie!</h2>
                            <p>Get your favorite meals from top-rated restaurants delivered hot and fresh in 30 minutes.</p>
                            
                            <div className="demo-credentials-box">
                                <strong>⚡ Quick 1-Click Demo Logins:</strong>
                                <div className="demo-btns-stack">
                                    <button type="button" className="demo-login-pill" onClick={handleDemoUser}>
                                        👤 Login as Demo Customer (Alex)
                                    </button>
                                    <button type="button" className="demo-login-pill manager" onClick={handleDemoManager}>
                                        👔 Login as Restaurant Manager
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT FORM */}
                    <div className="auth-form-side">
                        <div className="auth-form-header">
                            <h2>Sign In to Foodie</h2>
                            <p>Enter your account credentials to continue</p>
                        </div>

                        {error && <div className="auth-error-alert">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} className="auth-main-form">
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <span className="field-icon">📧</span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-with-icon">
                                    <span className="field-icon">🔒</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="pwd-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="primary-btn auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : "Sign In →"}
                            </button>
                        </form>

                        <div className="auth-bottom-switch">
                            <span>Don't have an account?</span>
                            <Link to="/signup" className="switch-link">
                                Create an Account
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Login;