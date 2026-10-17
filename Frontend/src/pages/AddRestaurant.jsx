// src/pages/AddRestaurant.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RestaurantCard from "../components/RestaurantCard";
import { addRestaurant } from "../api/restaurantApi";
import { showToast } from "../components/Toast";
import { INITIAL_RESTAURANTS } from "../data/mockData";

const IMAGE_PRESETS = [
    { label: "Biryani & Curry", url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80" },
    { label: "Pizza & Italian", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80" },
    { label: "Burgers & Fries", url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80" },
    { label: "Asian & Wok", url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80" },
    { label: "Desserts & Cakes", url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80" }
];

function AddRestaurant() {
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState({
        restaurantName: "",
        location: "",
        cuisine: "North Indian, Biryani, Fast Food",
        rating: "4.5",
        deliveryTime: "25-30 min",
        priceForTwo: "₹400 for two",
        offer: "20% OFF with code FOODIE50",
        isPureVeg: false,
        image: IMAGE_PRESETS[0].url
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRestaurant((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!restaurant.restaurantName.trim()) {
            setError("Restaurant name is required");
            return;
        }

        if (!restaurant.location.trim()) {
            setError("Location is required");
            return;
        }

        setLoading(true);

        let createdResId = Date.now();

        try {
            const response = await addRestaurant({
                restaurantName: restaurant.restaurantName.trim(),
                location: restaurant.location.trim(),
                rating: Number(restaurant.rating) || 4.5
            });

            if (response.data?.data) {
                createdResId = response.data.data.resId;
            }
        } catch (err) {
            console.log("Backend response note:", err.message);
        }

        const newRestaurantData = {
            resId: createdResId,
            restaurantName: restaurant.restaurantName.trim(),
            location: restaurant.location.trim(),
            rating: Number(restaurant.rating) || 4.5,
            cuisine: restaurant.cuisine,
            deliveryTime: restaurant.deliveryTime,
            priceForTwo: restaurant.priceForTwo,
            offer: restaurant.offer,
            isPureVeg: restaurant.isPureVeg,
            image: restaurant.image,
            menu: []
        };

        INITIAL_RESTAURANTS.unshift(newRestaurantData);
        showToast(`🎉 "${restaurant.restaurantName}" has been added successfully!`, "success");
        navigate(`/restaurant/${createdResId}`);
        setLoading(false);
    };

    return (
        <div className="add-restaurant-page-wrapper">
            <Navbar />

            <main className="page-container add-res-layout">
                <div className="add-res-header">
                    <Link to="/restaurants" className="back-link-btn">
                        ← Back to Restaurants
                    </Link>
                    <h1>➕ Partner & Add New Restaurant</h1>
                    <p>Expand your business reach by listing your restaurant on Foodie</p>
                </div>

                <div className="add-res-grid">
                    {/* FORM */}
                    <div className="add-res-form-card">
                        {error && <div className="form-error-alert">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} className="add-restaurant-form">
                            <div className="form-group">
                                <label>Restaurant Name *</label>
                                <input
                                    type="text"
                                    name="restaurantName"
                                    placeholder="E.g., Spice Garden Bistro"
                                    value={restaurant.restaurantName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Location / Area *</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="E.g., Indiranagar, 100ft Road"
                                    value={restaurant.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Cuisines (Comma separated)</label>
                                <input
                                    type="text"
                                    name="cuisine"
                                    placeholder="E.g., Italian, Pizzas, Pastas"
                                    value={restaurant.cuisine}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-three-col">
                                <div className="form-group">
                                    <label>Initial Rating (0-5)</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        value={restaurant.rating}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Avg. Delivery Time</label>
                                    <input
                                        type="text"
                                        name="deliveryTime"
                                        placeholder="E.g., 20-30 min"
                                        value={restaurant.deliveryTime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Price for Two</label>
                                    <input
                                        type="text"
                                        name="priceForTwo"
                                        placeholder="E.g., ₹400 for two"
                                        value={restaurant.priceForTwo}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Promotional Offer Tag</label>
                                <input
                                    type="text"
                                    name="offer"
                                    placeholder="E.g., 40% OFF up to ₹100"
                                    value={restaurant.offer}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="custom-checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isPureVeg"
                                        checked={restaurant.isPureVeg}
                                        onChange={handleChange}
                                    />
                                    <span>🌱 Pure Vegetarian Restaurant</span>
                                </label>
                            </div>

                            {/* IMAGE PRESETS */}
                            <div className="form-group">
                                <label>Choose Cover Image Preset</label>
                                <div className="image-presets-row">
                                    {IMAGE_PRESETS.map((p) => (
                                        <button
                                            key={p.label}
                                            type="button"
                                            className={`preset-btn ${restaurant.image === p.url ? "selected" : ""}`}
                                            onClick={() => setRestaurant({ ...restaurant, image: p.url })}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => navigate("/restaurants")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={loading}
                                >
                                    {loading ? "Publishing..." : "Publish Restaurant →"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* LIVE PREVIEW CARD */}
                    <div className="add-res-preview-side">
                        <div className="preview-sticky-card">
                            <h3>👁️ Live Card Preview</h3>
                            <p className="preview-sub">This is how your restaurant card appears to customers:</p>
                            <div className="preview-card-wrapper">
                                <RestaurantCard
                                    restaurant={{
                                        ...restaurant,
                                        resId: 999,
                                        restaurantName: restaurant.restaurantName || "Your Restaurant Name",
                                        location: restaurant.location || "City Location",
                                        rating: restaurant.rating || "4.5"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AddRestaurant;