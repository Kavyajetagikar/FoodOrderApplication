// src/pages/Home.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RestaurantCard from "../components/RestaurantCard";
import { CUISINES, INITIAL_RESTAURANTS, COUPONS } from "../data/mockData";

function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("MG Road, Bangalore");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/restaurants");
        }
    };

    const topRatedRestaurants = [...INITIAL_RESTAURANTS]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

    return (
        <div className="home-wrapper">
            <Navbar />

            {/* HERO SECTION */}
            <section className="home-hero-v2">
                <div className="hero-container">
                    <div className="hero-text-block">
                        <div className="hero-pill">
                            <span className="pill-dot"></span>
                            <span>⚡ Fast 30-Minute Food Delivery in Your City</span>
                        </div>

                        <h1 className="hero-heading">
                            Hungry? Discover & Order <br />
                            <span className="hero-gradient-text">Delicious Food</span> Around You.
                        </h1>

                        <p className="hero-subtext">
                            From royal biryanis and cheesy pizzas to sizzling burgers and sweet desserts,
                            get the best dishes delivered fresh to your door.
                        </p>

                        {/* SEARCH & LOCATION COMPONENT */}
                        <form onSubmit={handleSearchSubmit} className="hero-search-box">
                            <div className="location-select-wrapper">
                                <span className="loc-icon">📍</span>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="location-dropdown"
                                >
                                    <option value="MG Road, Bangalore">MG Road, Bangalore</option>
                                    <option value="Indiranagar 100ft Rd">Indiranagar, Bangalore</option>
                                    <option value="Koramangala 5th Block">Koramangala, Bangalore</option>
                                    <option value="HSR Layout Sector 2">HSR Layout, Bangalore</option>
                                    <option value="Whitefield Main Road">Whitefield, Bangalore</option>
                                </select>
                            </div>

                            <div className="search-divider"></div>

                            <div className="search-input-wrapper">
                                <span className="dish-search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search for restaurants, burgers, biryani..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="hero-submit-btn">
                                Find Food
                            </button>
                        </form>

                        {/* HERO STATS */}
                        <div className="hero-stats-row">
                            <div className="stat-item">
                                <strong>500+</strong>
                                <span>Curated Restaurants</span>
                            </div>
                            <div className="stat-sep">•</div>
                            <div className="stat-item">
                                <strong>25 Mins</strong>
                                <span>Average Delivery</span>
                            </div>
                            <div className="stat-sep">•</div>
                            <div className="stat-item">
                                <strong>4.8 ★</strong>
                                <span>App Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* HERO RIGHT GRAPHIC */}
                    <div className="hero-graphic-block">
                        <div className="hero-image-card">
                            <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&auto=format&fit=crop&q=80"
                                alt="Delicious Gourmet Spread"
                                className="hero-main-img"
                            />
                            <div className="floating-order-badge">
                                <span className="float-emoji">🛵</span>
                                <div>
                                    <div className="float-title">Order on the way!</div>
                                    <div className="float-sub">Arriving in 18 mins</div>
                                </div>
                            </div>
                            <div className="floating-rating-badge">
                                <span className="star-icon">⭐</span>
                                <div>
                                    <strong>4.9 / 5.0</strong>
                                    <small>Over 10k Happy Foodies</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT'S ON YOUR MIND? CUISINE BUBBLES */}
            <section className="home-section cuisines-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">What's on your mind?</h2>
                        <p className="section-desc">Explore top culinary categories handcrafted for every mood</p>
                    </div>
                    <Link to="/restaurants" className="section-see-all">
                        See All Cuisines →
                    </Link>
                </div>

                <div className="cuisine-carousel">
                    {CUISINES.map((c) => (
                        <Link
                            key={c.id}
                            to={`/restaurants?cuisine=${c.id === "all" ? "" : c.id}`}
                            className="cuisine-bubble-card"
                        >
                            <div className="cuisine-icon-wrapper">
                                <span className="cuisine-emoji">{c.icon}</span>
                            </div>
                            <span className="cuisine-label">{c.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* PROMO COUPON BANNERS */}
            <section className="home-section offers-section">
                <div className="offers-grid">
                    <div className="offer-banner-card banner-gradient-1">
                        <div className="banner-text">
                            <span className="banner-badge">NEW USER SPECIAL</span>
                            <h3>Flat 50% OFF</h3>
                            <p>Use code <strong>FOODIE50</strong> on your first order!</p>
                            <Link to="/restaurants" className="banner-btn">Order Now</Link>
                        </div>
                        <div className="banner-icon">🍔</div>
                    </div>

                    <div className="offer-banner-card banner-gradient-2">
                        <div className="banner-text">
                            <span className="banner-badge">FREE DELIVERY</span>
                            <h3>Zero Delivery Fee</h3>
                            <p>Use code <strong>FREEDEL</strong> on orders above ₹99.</p>
                            <Link to="/restaurants" className="banner-btn">Claim Now</Link>
                        </div>
                        <div className="banner-icon">🍕</div>
                    </div>
                </div>
            </section>

            {/* TOP RATED RESTAURANTS */}
            <section className="home-section top-restaurants-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Top Rated Restaurants</h2>
                        <p className="section-desc">Highest rated culinary spots trending in your area</p>
                    </div>
                    <Link to="/restaurants" className="section-see-all">
                        View All Restaurants ({INITIAL_RESTAURANTS.length}) →
                    </Link>
                </div>

                <div className="restaurant-cards-grid">
                    {topRatedRestaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.resId} restaurant={restaurant} />
                    ))}
                </div>
            </section>

            {/* WHY CHOOSE FOODIE */}
            <section className="home-features-v2">
                <div className="features-container">
                    <div className="features-intro">
                        <span className="features-sub">THE FOODIE PROMISE</span>
                        <h2>Why Millions Love Ordering With Us</h2>
                    </div>

                    <div className="features-quad-grid">
                        <div className="feature-box">
                            <div className="feature-icon-circle">⚡</div>
                            <h3>Superfast Delivery</h3>
                            <p>Hot, fresh meals delivered straight to your door with smart GPS route optimization.</p>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon-circle">📍</div>
                            <h3>Live GPS Order Tracking</h3>
                            <p>Follow your meal step-by-step from kitchen preparation to your doorstep in real-time.</p>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon-circle">💎</div>
                            <h3>Hygiene & Quality Certified</h3>
                            <p>We partner only with safety-certified restaurants maintaining 100% kitchen cleanliness.</p>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon-circle">🎁</div>
                            <h3>Daily Offers & Cashback</h3>
                            <p>Enjoy huge discounts, exclusive promo coupons, and exciting rewards on every bite.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="home-cta-banner">
                <div className="cta-content">
                    <h2>Ready to treat your taste buds?</h2>
                    <p>Order from hundreds of top-rated kitchens in your neighborhood now.</p>
                    <div className="cta-actions">
                        <Link to="/restaurants" className="cta-main-btn">
                            Explore All Restaurants →
                        </Link>
                        <Link to="/signup" className="cta-sub-btn">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;