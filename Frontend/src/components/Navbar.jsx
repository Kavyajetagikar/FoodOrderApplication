// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCustomer } from "../context/CustomerContext";

function Navbar() {
    const navigate = useNavigate();
    const { totalItems, totalAmount } = useCart();
    const { customer, logoutCustomer, favoriteRestaurants } = useCustomer();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logoutCustomer();
        setShowUserMenu(false);
        setMobileMenuOpen(false);
        navigate("/login");
    };

    return (
        <header className="navbar-wrapper">
            <nav className="navbar-container">
                {/* BRAND LOGO */}
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🍔</span>
                    <span className="brand-name">Foodie</span>
                </Link>

                {/* SEARCH BAR (DESKTOP) */}
                <form onSubmit={handleSearch} className="navbar-search-form">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search for restaurants, biryani, pizza..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="navbar-search-input"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="search-clear-btn"
                            onClick={() => setSearchQuery("")}
                        >
                            ✕
                        </button>
                    )}
                </form>

                {/* DESKTOP NAV LINKS */}
                <div className="navbar-nav-links">
                    <NavLink
                        to="/restaurants"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        <span>🍽️</span> Restaurants
                    </NavLink>

                    <NavLink
                        to="/favorites"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        <span>❤️</span> Favorites
                        {favoriteRestaurants.length > 0 && (
                            <span className="nav-badge">{favoriteRestaurants.length}</span>
                        )}
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        <span>📦</span> Orders
                    </NavLink>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="navbar-actions">
                    {/* CART BUTTON */}
                    <Link to="/cart" className="navbar-cart-pill" title="View Cart">
                        <span className="cart-pill-icon">🛒</span>
                        <span className="cart-pill-text">Cart</span>
                        {totalItems > 0 && (
                            <span className="cart-pill-badge pulse-anim">{totalItems}</span>
                        )}
                    </Link>

                    {/* USER AUTH / DROPDOWN */}
                    {customer ? (
                        <div className="user-dropdown-container">
                            <button
                                className="user-profile-btn"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                aria-expanded={showUserMenu}
                            >
                                <span className="user-avatar">
                                    {customer.customerName?.charAt(0)?.toUpperCase() || "👤"}
                                </span>
                                <span className="user-name">
                                    {customer.customerName?.split(" ")[0] || "Account"}
                                </span>
                                <span className="chevron-down">▾</span>
                            </button>

                            {showUserMenu && (
                                <div className="user-dropdown-menu" onClick={() => setShowUserMenu(false)}>
                                    <div className="dropdown-user-header">
                                        <div className="dropdown-name">{customer.customerName}</div>
                                        <div className="dropdown-email">{customer.email}</div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link to="/profile" className="dropdown-item">
                                        <span>👤</span> My Profile & Addresses
                                    </Link>
                                    <Link to="/orders" className="dropdown-item">
                                        <span>📦</span> My Orders & Tracking
                                    </Link>
                                    <Link to="/favorites" className="dropdown-item">
                                        <span>❤️</span> Saved Favorites
                                    </Link>
                                    <Link to="/add-restaurant" className="dropdown-item">
                                        <span>➕</span> Add New Restaurant
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-item logout">
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="login-nav-btn">
                                Sign In
                            </Link>
                            <Link to="/signup" className="signup-nav-btn">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* MOBILE HAMBURGER */}
                    <button
                        className="mobile-hamburger-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </nav>

            {/* MOBILE DRAWER */}
            {mobileMenuOpen && (
                <div className="mobile-drawer" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSearch} className="mobile-search-form">
                            <input
                                type="text"
                                placeholder="Search dishes & restaurants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit">Search</button>
                        </form>

                        <div className="mobile-nav-list">
                            <Link to="/restaurants" onClick={() => setMobileMenuOpen(false)}>
                                <span>🍽️</span> Browse Restaurants
                            </Link>
                            <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>
                                <span>❤️</span> Wishlist Favorites ({favoriteRestaurants.length})
                            </Link>
                            <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                                <span>📦</span> Track Orders
                            </Link>
                            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                                <span>🛒</span> Cart ({totalItems} items)
                            </Link>
                            {customer ? (
                                <>
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                                        <span>👤</span> Profile ({customer.customerName})
                                    </Link>
                                    <Link to="/add-restaurant" onClick={() => setMobileMenuOpen(false)}>
                                        <span>➕</span> Partner with Us
                                    </Link>
                                    <button onClick={handleLogout} className="mobile-logout-btn">
                                        <span>🚪</span> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="mobile-auth-actions">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="primary-btn">
                                        Login
                                    </Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="secondary-btn">
                                        Create Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;