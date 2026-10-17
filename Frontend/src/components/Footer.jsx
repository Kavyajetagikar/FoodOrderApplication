// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-emoji">🍔</span>
                            <span>Foodie</span>
                        </Link>
                        <p className="footer-tagline">
                            Delivering happiness, authentic flavors, and piping hot meals right to your doorstep in minutes.
                        </p>
                        <div className="footer-socials">
                            <a href="#instagram" className="social-icon" aria-label="Instagram">📸</a>
                            <a href="#twitter" className="social-icon" aria-label="Twitter">🐦</a>
                            <a href="#facebook" className="social-icon" aria-label="Facebook">📘</a>
                            <a href="#youtube" className="social-icon" aria-label="YouTube">▶️</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Explore</h4>
                        <ul>
                            <li><Link to="/restaurants">All Restaurants</Link></li>
                            <li><Link to="/restaurants?filter=top-rated">Top Rated</Link></li>
                            <li><Link to="/favorites">Favorites & Wishlist</Link></li>
                            <li><Link to="/add-restaurant">+ Partner With Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Popular Cuisines</h4>
                        <ul>
                            <li><Link to="/restaurants?cuisine=biryani">Dum Biryani</Link></li>
                            <li><Link to="/restaurants?cuisine=pizza">Italian Pizzas</Link></li>
                            <li><Link to="/restaurants?cuisine=burger">Gourmet Burgers</Link></li>
                            <li><Link to="/restaurants?cuisine=desserts">Desserts & Shakes</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Customer Care</h4>
                        <ul>
                            <li><Link to="/orders">Order Tracking</Link></li>
                            <li><Link to="/profile">Account Settings</Link></li>
                            <li><a href="#support">24x7 Live Chat Support</a></li>
                            <li><a href="#faq">Delivery FAQ</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Foodie Technologies Pvt. Ltd. All rights reserved.</p>
                    <div className="footer-links-inline">
                        <a href="#terms">Terms of Service</a>
                        <span>•</span>
                        <a href="#privacy">Privacy Policy</a>
                        <span>•</span>
                        <a href="#cookies">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
