// src/pages/AddMenuItem.jsx
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addMenuItem } from "../api/menuApi";
import { showToast } from "../components/Toast";

function AddMenuItem() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Main Course");
    const [isVeg, setIsVeg] = useState(true);
    const [description, setDescription] = useState("");
    const [availability, setAvailability] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!itemName.trim()) {
            setError("Please enter menu item name");
            return;
        }

        if (!price || Number(price) <= 0) {
            setError("Please enter a valid price");
            return;
        }

        setLoading(true);

        const backendPayload = {
            itemName: itemName.trim(),
            price: Math.round(Number(price)),
            availability: Boolean(availability)
        };

        try {
            await addMenuItem(Number(id), backendPayload);
        } catch (err) {
            console.log("Backend menu item note:", err.message);
        }

        showToast(`Added "${itemName}" to the menu!`, "success");
        navigate(`/restaurant/${id}`);
        setLoading(false);
    };

    return (
        <div className="add-menu-page-wrapper">
            <Navbar />

            <main className="page-container add-menu-layout">
                <div className="add-menu-card">
                    <div className="form-header">
                        <Link to={`/restaurant/${id}`} className="back-link-btn">
                            ← Back to Restaurant
                        </Link>
                        <h1>🍽️ Add Menu Item</h1>
                        <p>Adding a new item for Restaurant ID #{id}</p>
                    </div>

                    {error && <div className="form-error-alert">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} className="add-menu-form">
                        <div className="form-group">
                            <label>Item Name *</label>
                            <input
                                type="text"
                                placeholder="E.g., Crispy Butter Chicken Slider"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-two-col">
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    placeholder="E.g., 249"
                                    min="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="Starters">Starters & Appetizers</option>
                                    <option value="Main Course">Main Course</option>
                                    <option value="Biryani & Indian">Biryani & Indian</option>
                                    <option value="Pizzas">Pizzas</option>
                                    <option value="Burgers">Burgers</option>
                                    <option value="Pastas">Pastas</option>
                                    <option value="Desserts & Cakes">Desserts & Cakes</option>
                                    <option value="Drinks & Shakes">Drinks & Shakes</option>
                                    <option value="Breads">Breads</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Dietary Type</label>
                            <div className="radio-group-inline">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        checked={isVeg}
                                        onChange={() => setIsVeg(true)}
                                    />
                                    🌱 Vegetarian
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        checked={!isVeg}
                                        onChange={() => setIsVeg(false)}
                                    />
                                    🍗 Non-Vegetarian
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description & Ingredients</label>
                            <textarea
                                placeholder="E.g., Freshly grilled cottage cheese with signature herbs and spiced mayo..."
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="custom-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={availability}
                                    onChange={(e) => setAvailability(e.target.checked)}
                                />
                                <span>Item is currently In Stock & Available for ordering</span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => navigate(`/restaurant/${id}`)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add to Menu"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AddMenuItem;