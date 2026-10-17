// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCustomer } from "../context/CustomerContext";
import { createCustomer } from "../api/customerApi";
import { showToast } from "../components/Toast";

function Signup() {
    const navigate = useNavigate();
    const { loginCustomer } = useCustomer();

    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        contact: "",
        address: ""
    });

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

        if (!formData.customerName.trim()) {
            setError("Please enter your full name");
            return;
        }

        if (!formData.email.trim() || !formData.email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        if (!formData.contact.trim() || formData.contact.length < 10) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        if (!formData.address.trim()) {
            setError("Please enter your delivery address");
            return;
        }

        setLoading(true);

        let customerProfile = {
            customerId: Math.floor(100 + Math.random() * 900),
            customerName: formData.customerName.trim(),
            email: formData.email.trim(),
            contact: Number(formData.contact),
            phone: formData.contact.trim(),
            address: formData.address.trim()
        };

        try {
            const response = await createCustomer({
                customerName: formData.customerName.trim(),
                email: formData.email.trim(),
                contact: Number(formData.contact),
                address: formData.address.trim()
            });

            if (response.data?.data) {
                const saved = response.data.data;
                customerProfile = {
                    ...saved,
                    customerId: saved.customerId,
                    customerName: saved.customerName,
                    email: saved.email,
                    contact: saved.contact,
                    phone: String(saved.contact || formData.contact.trim()),
                    address: saved.address
                };
            }
        } catch (err) {
            console.log("Backend response note:", err.message);
        }

        loginCustomer(customerProfile);
        showToast("Account created successfully! Welcome to Foodie 🎉", "success");
        navigate("/restaurants");
        setLoading(false);
    };

    return (
        <div className="auth-page-wrapper">
            <Navbar />

            <main className="page-container auth-layout">
                <div className="auth-card-container">
                    {/* LEFT PROMO BANNER */}
                    <div className="auth-side-banner">
                        <div className="banner-content">
                            <span className="banner-hero-icon">🍕</span>
                            <h2>Join Foodie Today!</h2>
                            <p>Unlock 50% discount on your first order with coupon <strong>FOODIE50</strong>, earn reward points, and track live deliveries.</p>
                            <div className="benefits-list">
                                <div>⚡ 30-Minute Guaranteed Delivery</div>
                                <div>🎁 Daily Coupons & Free Treats</div>
                                <div>🛵 Real-time Live Order Tracking</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT FORM */}
                    <div className="auth-form-side">
                        <div className="auth-form-header">
                            <h2>Create Your Account</h2>
                            <p>Get started with delicious food ordering in seconds</p>
                        </div>

                        {error && <div className="auth-error-alert">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} className="auth-main-form">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <div className="input-with-icon">
                                    <span className="field-icon">👤</span>
                                    <input
                                        type="text"
                                        name="customerName"
                                        placeholder="E.g., John Doe"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
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
                                <label>Mobile Number *</label>
                                <div className="input-with-icon">
                                    <span className="field-icon">📱</span>
                                    <input
                                        type="tel"
                                        name="contact"
                                        placeholder="10-digit mobile number"
                                        maxLength="10"
                                        value={formData.contact}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "");
                                            setFormData({ ...formData, contact: val });
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Delivery Address *</label>
                                <div className="input-with-icon textarea-icon">
                                    <span className="field-icon">📍</span>
                                    <textarea
                                        name="address"
                                        placeholder="Enter your street address, building, floor..."
                                        rows="2"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="primary-btn auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account →"}
                            </button>
                        </form>

                        <div className="auth-bottom-switch">
                            <span>Already have an account?</span>
                            <Link to="/login" className="switch-link">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Signup;