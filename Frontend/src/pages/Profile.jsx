import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCustomer } from "../context/CustomerContext";
import { showToast } from "../components/Toast";
import { updateCustomer } from "../api/customerApi";

function Profile() {
    const navigate = useNavigate();
    const {
        customer,
        loginCustomer,
        logoutCustomer,
        savedAddresses,
        addAddress,
        deleteAddress,
        favoriteRestaurants,
        localOrders
    } = useCustomer();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(customer?.customerName || "");
    const [email, setEmail] = useState(customer?.email || "");
    const [phone, setPhone] = useState(customer?.phone || "");

    const [showAddrForm, setShowAddrForm] = useState(false);
    const [newAddr, setNewAddr] = useState({ title: "Home", address: "", phone: customer?.phone || "" });

    if (!customer) {
        return (
            <div className="profile-page-wrapper">
                <Navbar />
                <main className="page-container empty-profile-view">
                    <div className="empty-cart-card">
                        <div className="empty-cart-art">👤</div>
                        <h2>Please Sign In</h2>
                        <p>Sign in to access your profile, saved addresses, favorites, and order history.</p>
                        <div className="empty-auth-btns">
                            <Link to="/login" className="primary-btn">Sign In</Link>
                            <Link to="/signup" className="secondary-btn">Create Account</Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const updatedCustomer = {
            ...customer,
            customerName: name.trim(),
            email: email.trim(),
            contact: Number(phone.trim()) || customer.contact,
            phone: phone.trim(),
            address: customer.address || "Bangalore"
        };

        try {
            if (customer.customerId) {
                await updateCustomer(customer.customerId, {
                    customerName: name.trim(),
                    email: email.trim(),
                    contact: Number(phone.trim()) || customer.contact,
                    address: customer.address || "Bangalore"
                });
            }
        } catch (err) {
            console.log("Customer update backend notice:", err.message);
        }

        loginCustomer(updatedCustomer);
        setIsEditing(false);
        showToast("Profile details updated successfully!", "success");
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        if (!newAddr.address.trim()) return;
        addAddress(newAddr);
        setNewAddr({ title: "Home", address: "", phone: customer.phone || "" });
        setShowAddrForm(false);
    };

    return (
        <div className="profile-page-wrapper">
            <Navbar />

            <main className="page-container profile-layout">
                {/* PROFILE HEADER / AVATAR */}
                <div className="profile-hero-card">
                    <div className="profile-avatar-large">
                        {customer.customerName?.charAt(0)?.toUpperCase() || "👤"}
                    </div>

                    <div className="profile-hero-info">
                        <h2>{customer.customerName}</h2>
                        <p>{customer.email} • {customer.phone}</p>
                        <span className="profile-member-badge">⭐ Foodie Gold Member</span>
                    </div>

                    <div className="profile-stats-cards">
                        <div className="stat-badge">
                            <strong>{localOrders.length}</strong>
                            <span>Total Orders</span>
                        </div>
                        <div className="stat-badge">
                            <strong>{favoriteRestaurants.length}</strong>
                            <span>Saved Spots</span>
                        </div>
                        <div className="stat-badge">
                            <strong>₹350</strong>
                            <span>Savings Earned</span>
                        </div>
                    </div>
                </div>

                <div className="profile-grid">
                    {/* LEFT: PERSONAL INFORMATION */}
                    <div className="profile-card">
                        <div className="card-header-flex">
                            <h3>👤 Personal Details</h3>
                            {!isEditing && (
                                <button
                                    type="button"
                                    className="edit-text-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSaveProfile} className="profile-edit-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="primary-btn">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-info-display">
                                <div className="info-row">
                                    <span className="label">Full Name:</span>
                                    <span className="value">{customer.customerName}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Email Address:</span>
                                    <span className="value">{customer.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Phone Number:</span>
                                    <span className="value">{customer.phone}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: SAVED ADDRESSES */}
                    <div className="profile-card">
                        <div className="card-header-flex">
                            <h3>📍 Saved Delivery Addresses</h3>
                            <button
                                type="button"
                                className="add-addr-text-btn"
                                onClick={() => setShowAddrForm(!showAddrForm)}
                            >
                                {showAddrForm ? "✕ Cancel" : "+ Add New"}
                            </button>
                        </div>

                        {showAddrForm && (
                            <form onSubmit={handleAddAddress} className="add-addr-inline-form">
                                <div className="form-group">
                                    <label>Location Tag</label>
                                    <select
                                        value={newAddr.title}
                                        onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work / Office">Work / Office</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Complete Address</label>
                                    <input
                                        type="text"
                                        placeholder="Flat/House no, building, street, area"
                                        value={newAddr.address}
                                        onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="primary-btn">Save Address</button>
                            </form>
                        )}

                        <div className="saved-addr-stack">
                            {savedAddresses.map((addr) => (
                                <div key={addr.id} className="profile-addr-row">
                                    <div className="addr-icon">
                                        {addr.title?.includes("Work") ? "🏢" : "🏠"}
                                    </div>
                                    <div className="addr-details">
                                        <strong>{addr.title}</strong>
                                        <p>{addr.address}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="delete-addr-btn"
                                        onClick={() => deleteAddress(addr.id)}
                                        title="Delete address"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <div className="profile-logout-section">
                    <button
                        type="button"
                        className="logout-main-btn"
                        onClick={() => {
                            logoutCustomer();
                            navigate("/login");
                        }}
                    >
                        🚪 Logout from Account
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Profile;