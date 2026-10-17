import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MenuCard from "../components/MenuCard";
import ItemCustomizationModal from "../components/ItemCustomizationModal";
import { showToast } from "../components/Toast";
import { useCustomer } from "../context/CustomerContext";
import { useCart } from "../context/CartContext";
import { getRestaurantById, getRestaurantMenu } from "../api/restaurantApi";
import { addMenuItem, updateMenuPrice, updateAvailability, deleteMenuItem } from "../api/menuApi";
import { INITIAL_RESTAURANTS } from "../data/mockData";
import useDebounce from "../hooks/useDebounce";
import { getOptimizedImageUrl } from "../utils/imageUtils";

function RestaurantDetails() {
    const { id } = useParams();
    const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useCustomer();
    const { totalItems, totalAmount } = useCart();

    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [dishSearch, setDishSearch] = useState("");
    const debouncedDishSearch = useDebounce(dishSearch, 200);
    const [vegOnly, setVegOnly] = useState(false);

    // Manager mode toggle
    const [isManagerMode, setIsManagerMode] = useState(false);

    // Modal state for dish customization
    const [activeModalItem, setActiveModalItem] = useState(null);

    // Add menu item form modal
    const [showAddMenuModal, setShowAddMenuModal] = useState(false);
    const [newDish, setNewDish] = useState({
        itemName: "",
        price: "",
        category: "Main Course",
        isVeg: true,
        description: "",
        availability: true,
        image: ""
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        const numId = Number(id);
        const fallbackRes = INITIAL_RESTAURANTS.find((r) => r.resId === numId) || INITIAL_RESTAURANTS[0];

        try {
            // Attempt API fetch
            const resPromise = getRestaurantById(id);
            const menuPromise = getRestaurantMenu(id);
            const [resRes, menuRes] = await Promise.allSettled([resPromise, menuPromise]);

            let activeRes = fallbackRes;

            if (resRes.status === "fulfilled" && resRes.value.data?.data) {
                const apiRes = resRes.value.data.data;
                activeRes = {
                    ...fallbackRes,
                    ...apiRes,
                    resId: apiRes.resId || apiRes.restaurantId || fallbackRes.resId,
                    restaurantName: apiRes.restaurantName || fallbackRes.restaurantName,
                    location: apiRes.location || fallbackRes.location,
                    rating: apiRes.rating || fallbackRes.rating
                };
                setRestaurant(activeRes);

                if (menuRes.status === "fulfilled" && menuRes.value.data?.data && menuRes.value.data.data.length > 0) {
                    const apiMenu = menuRes.value.data.data.map((item, idx) => ({
                        ...item,
                        itemId: item.itemId || item.menuItemId || 100 + idx,
                        menuItemId: item.itemId || item.menuItemId || 100 + idx,
                        image: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
                        category: item.category || "Main Course",
                        isVeg: item.isVeg !== undefined ? item.isVeg : true,
                        availability: item.availability !== false,
                        restaurant: activeRes
                    }));
                    setMenuItems(apiMenu);
                } else {
                    setMenuItems([]);
                }
            } else {
                setRestaurant(fallbackRes);
                if (menuRes.status === "fulfilled" && menuRes.value.data?.data && menuRes.value.data.data.length > 0) {
                    const apiMenu = menuRes.value.data.data.map((item, idx) => ({
                        ...item,
                        itemId: item.itemId || item.menuItemId || 100 + idx,
                        menuItemId: item.itemId || item.menuItemId || 100 + idx,
                        image: item.image || fallbackRes.menu[idx % fallbackRes.menu.length]?.image || fallbackRes.image,
                        category: item.category || "Main Course",
                        isVeg: item.isVeg !== undefined ? item.isVeg : true,
                        availability: item.availability !== false,
                        restaurant: fallbackRes
                    }));
                    setMenuItems(apiMenu);
                } else {
                    setMenuItems(fallbackRes.menu || []);
                }
            }
        } catch (err) {
            console.log("Using fallback restaurant menu:", err.message);
            setRestaurant(fallbackRes);
            setMenuItems(fallbackRes.menu || []);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Category list derived from menu items
    const categories = useMemo(() => {
        const set = new Set(["All"]);
        menuItems.forEach((item) => {
            if (item.category) set.add(item.category);
        });
        return Array.from(set);
    }, [menuItems]);

    // Filtered menu with debounced search
    const filteredMenu = useMemo(() => {
        return menuItems.filter((item) => {
            if (selectedCategory !== "All" && item.category !== selectedCategory) {
                return false;
            }
            if (vegOnly && !item.isVeg) {
                return false;
            }
            if (debouncedDishSearch.trim()) {
                const q = debouncedDishSearch.toLowerCase();
                const nameMatch = (item.itemName || "").toLowerCase().includes(q);
                const descMatch = (item.description || "").toLowerCase().includes(q);
                if (!nameMatch && !descMatch) return false;
            }
            return true;
        });
    }, [menuItems, selectedCategory, vegOnly, debouncedDishSearch]);

    // Manager Actions memoized
    const handleAddDish = useCallback(async (e) => {
        e.preventDefault();
        if (!newDish.itemName.trim() || !newDish.price) {
            showToast("Please enter item name and price", "error");
            return;
        }

        // Clean payload strictly matching backend MenuItem entity
        const backendPayload = {
            itemName: newDish.itemName.trim(),
            price: Math.round(Number(newDish.price)),
            availability: newDish.availability !== false
        };

        let createdId = Date.now();

        try {
            const response = await addMenuItem(Number(id), backendPayload);
            if (response.data?.data) {
                createdId = response.data.data.itemId || response.data.data.menuItemId || createdId;
            }
        } catch (err) {
            console.log("Backend menu item note:", err.message);
        }

        const createdItem = {
            ...newDish,
            ...backendPayload,
            itemId: createdId,
            menuItemId: createdId,
            restaurant: restaurant,
            image:
                newDish.image ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
        };

        setMenuItems((prev) => [createdItem, ...prev]);
        showToast(`Added "${backendPayload.itemName}" to the menu!`, "success");
        setShowAddMenuModal(false);
        setNewDish({
            itemName: "",
            price: "",
            category: "Main Course",
            isVeg: true,
            description: "",
            availability: true,
            image: ""
        });
    }, [id, newDish, restaurant]);

    const handleEditPrice = useCallback(async (itemId, currentPrice) => {
        const newPrice = prompt("Enter new price (₹):", currentPrice);
        if (!newPrice || isNaN(newPrice) || Number(newPrice) <= 0) return;

        const roundedPrice = Math.round(Number(newPrice));

        try {
            await updateMenuPrice(itemId, roundedPrice);
        } catch (err) {
            console.log("Local update price note:", err.message);
        }

        setMenuItems((prev) =>
            prev.map((item) =>
                (item.itemId === itemId || item.menuItemId === itemId)
                    ? { ...item, price: roundedPrice }
                    : item
            )
        );
        showToast("Price updated successfully!", "success");
    }, []);

    const handleToggleAvailability = useCallback(async (itemId, currentStatus) => {
        try {
            await updateAvailability(itemId, !currentStatus);
        } catch (err) {
            console.log("Local update availability note:", err.message);
        }

        setMenuItems((prev) =>
            prev.map((item) =>
                (item.itemId === itemId || item.menuItemId === itemId)
                    ? { ...item, availability: !currentStatus }
                    : item
            )
        );
        showToast(`Item is now ${!currentStatus ? "Available" : "Disabled"}`, "info");
    }, []);

    const handleDeleteDish = useCallback(async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this menu item?")) return;

        try {
            await deleteMenuItem(itemId);
        } catch (err) {
            console.log("Local delete note:", err.message);
        }

        setMenuItems((prev) =>
            prev.filter((item) => item.itemId !== itemId && item.menuItemId !== itemId)
        );
        showToast("Menu item deleted.", "info");
    }, []);

    const handleOpenModal = useCallback((item) => {
        setActiveModalItem(item);
    }, []);

    const handleCloseModal = useCallback(() => {
        setActiveModalItem(null);
    }, []);

    if (loading) {
        return (
            <div className="res-details-wrapper">
                <Navbar />
                <div className="page-container loading-container">
                    <div className="skeleton-header"></div>
                    <div className="loading-spinner"></div>
                    <p>Loading restaurant menu & dishes...</p>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="res-details-wrapper">
                <Navbar />
                <div className="page-container empty-state-box">
                    <h2>Restaurant Not Found</h2>
                    <p>The restaurant you are looking for does not exist or has been removed.</p>
                    <Link to="/restaurants" className="primary-btn">
                        Back to Restaurants
                    </Link>
                </div>
            </div>
        );
    }

    const isFav = isFavoriteRestaurant(restaurant.resId);

    return (
        <div className="res-details-wrapper">
            <Navbar />

            {/* BREADCRUMB */}
            <div className="res-breadcrumb-bar">
                <div className="page-container">
                    <Link to="/restaurants" className="breadcrumb-link">
                        ← Back to Restaurants
                    </Link>
                    <span className="bc-sep">/</span>
                    <span className="bc-current">{restaurant.restaurantName}</span>
                </div>
            </div>

            {/* RESTAURANT HERO BANNER */}
            <section className="res-header-banner">
                <div className="page-container res-header-layout">
                    <div className="res-header-main">
                        <div className="res-header-badge-row">
                            {restaurant.isPureVeg && (
                                <span className="pure-veg-tag">🌱 Pure Veg</span>
                            )}
                            <span className="open-now-tag">🟢 Open Now</span>
                            {restaurant.offer && (
                                <span className="offer-tag">🏷️ {restaurant.offer}</span>
                            )}
                        </div>

                        <h1 className="res-title-text">{restaurant.restaurantName}</h1>
                        <p className="res-cuisine-text">{restaurant.cuisine || "Multi-cuisine, Fast Food"}</p>
                        <p className="res-address-text">📍 {restaurant.location || "Central Market"}</p>

                        <div className="res-info-pills">
                            <div className="info-pill rating-box">
                                <span className="star">★</span>
                                <strong>{restaurant.rating || "4.8"}</strong>
                                <small>({restaurant.ratingCount || "500+"} ratings)</small>
                            </div>
                            <div className="info-pill">
                                <span>⏱️</span>
                                <strong>{restaurant.deliveryTime || "25-30 min"}</strong>
                            </div>
                            <div className="info-pill">
                                <span>🛵</span>
                                <strong>{restaurant.distance || "2.5 km"}</strong>
                            </div>
                            <div className="info-pill">
                                <span>💰</span>
                                <strong>{restaurant.priceForTwo || "₹400 for two"}</strong>
                            </div>
                        </div>
                    </div>

                    {/* HERO ACTIONS */}
                    <div className="res-header-side">
                        <img
                            src={getOptimizedImageUrl(
                                restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
                                600,
                                85
                            )}
                            alt={restaurant.restaurantName}
                            className="res-cover-photo"
                            decoding="async"
                            onError={(e) => {
                                e.target.src =
                                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80";
                            }}
                        />

                        <div className="res-side-actions">
                            <button
                                type="button"
                                className={`hero-fav-btn ${isFav ? "active" : ""}`}
                                onClick={() => toggleFavoriteRestaurant(restaurant.resId)}
                            >
                                <span>{isFav ? "❤️ Saved to Favorites" : "🤍 Add to Favorites"}</span>
                            </button>

                            <button
                                type="button"
                                className={`manager-mode-toggle ${isManagerMode ? "active" : ""}`}
                                onClick={() => setIsManagerMode(!isManagerMode)}
                            >
                                <span>{isManagerMode ? "⚙️ Exit Manager Mode" : "🛠️ Manager Mode"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* MANAGER CONTROLS BAR (IF MANAGER MODE) */}
            {isManagerMode && (
                <div className="manager-toolbar-banner">
                    <div className="page-container toolbar-inner">
                        <div>
                            <strong>⚙️ Restaurant Manager Dashboard:</strong> Edit prices, toggle availability, or add new dishes.
                        </div>
                        <button
                            type="button"
                            className="primary-btn add-dish-toolbar-btn"
                            onClick={() => setShowAddMenuModal(true)}
                        >
                            ➕ Add New Dish
                        </button>
                    </div>
                </div>
            )}

            {/* MENU FILTER & SEARCH SECTION */}
            <div className="res-menu-container page-container">
                <div className="menu-filter-bar">
                    {/* DISH SEARCH */}
                    <div className="menu-search-input-box">
                        <span className="search-ico">🔍</span>
                        <input
                            type="text"
                            placeholder="Search dishes in this restaurant..."
                            value={dishSearch}
                            onChange={(e) => setDishSearch(e.target.value)}
                        />
                        {dishSearch && (
                            <button
                                type="button"
                                className="search-clear"
                                onClick={() => setDishSearch("")}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* VEG FILTER */}
                    <button
                        type="button"
                        className={`veg-toggle-chip ${vegOnly ? "active" : ""}`}
                        onClick={() => setVegOnly(!vegOnly)}
                    >
                        🌱 Veg Only
                    </button>
                </div>

                {/* CATEGORY TABS */}
                <div className="category-tabs-scroll">
                    {categories.map((cat) => {
                        const count =
                            cat === "All"
                                ? menuItems.length
                                : menuItems.filter((m) => m.category === cat).length;

                        return (
                            <button
                                key={cat}
                                type="button"
                                className={`cat-tab-btn ${selectedCategory === cat ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                <span>{cat}</span>
                                <span className="cat-count">({count})</span>
                            </button>
                        );
                    })}
                </div>

                {/* MENU ITEMS GRID */}
                <div className="menu-section-header">
                    <h2>
                        {selectedCategory === "All" ? "Full Menu" : selectedCategory}
                        <span className="count-sub">({filteredMenu.length} items)</span>
                    </h2>
                </div>

                {filteredMenu.length === 0 ? (
                    <div className="empty-menu-box">
                        <div className="empty-emoji">🍽️</div>
                        <h3>No dishes found</h3>
                        <p>Try searching for a different dish name or reset filters.</p>
                        {vegOnly && (
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => setVegOnly(false)}
                            >
                                Show Non-Veg Dishes Too
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="menu-items-grid">
                        {filteredMenu.map((item) => (
                            <MenuCard
                                key={item.menuItemId}
                                item={item}
                                onOpenModal={handleOpenModal}
                                isManager={isManagerMode}
                                onEditPrice={handleEditPrice}
                                onToggleAvailability={handleToggleAvailability}
                                onDelete={handleDeleteDish}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* DISH CUSTOMIZATION MODAL */}
            {activeModalItem && (
                <ItemCustomizationModal
                    item={activeModalItem}
                    onClose={handleCloseModal}
                />
            )}

            {/* ADD MENU ITEM MODAL (FOR MANAGERS) */}
            {showAddMenuModal && (
                <div className="modal-overlay" onClick={() => setShowAddMenuModal(false)}>
                    <div
                        className="modal-content add-dish-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close-btn"
                            onClick={() => setShowAddMenuModal(false)}
                        >
                            ✕
                        </button>
                        <h2>➕ Add New Menu Item</h2>
                        <p>Add a new delicious dish to this restaurant's menu.</p>

                        <form onSubmit={handleAddDish} className="add-dish-form">
                            <div className="form-group">
                                <label>Dish Name *</label>
                                <input
                                    type="text"
                                    placeholder="E.g., Butter Chicken Naan Combo"
                                    value={newDish.itemName}
                                    onChange={(e) =>
                                        setNewDish({ ...newDish, itemName: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        placeholder="E.g., 299"
                                        value={newDish.price}
                                        onChange={(e) =>
                                            setNewDish({ ...newDish, price: e.target.value })
                                        }
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={newDish.category}
                                        onChange={(e) =>
                                            setNewDish({ ...newDish, category: e.target.value })
                                        }
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
                                            checked={newDish.isVeg}
                                            onChange={() =>
                                                setNewDish({ ...newDish, isVeg: true })
                                            }
                                        />
                                        🌱 Veg
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            checked={!newDish.isVeg}
                                            onChange={() =>
                                                setNewDish({ ...newDish, isVeg: false })
                                            }
                                        />
                                        🍗 Non-Veg
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Detailed ingredients and preparation style..."
                                    value={newDish.description}
                                    onChange={(e) =>
                                        setNewDish({ ...newDish, description: e.target.value })
                                    }
                                    rows="2"
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={newDish.image}
                                    onChange={(e) =>
                                        setNewDish({ ...newDish, image: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => setShowAddMenuModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn">
                                    Add Item to Menu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FLOATING MOBILE CART BAR */}
            {totalItems > 0 && (
                <div className="mobile-floating-cart-bar">
                    <div className="floating-cart-info">
                        <span className="cart-badge-circle">{totalItems}</span>
                        <div>
                            <div className="cart-item-count">{totalItems} {totalItems === 1 ? "Item" : "Items"} in Cart</div>
                            <div className="cart-price-est">₹{totalAmount.toFixed(2)}</div>
                        </div>
                    </div>
                    <Link to="/cart" className="view-cart-floating-btn">
                        View Cart →
                    </Link>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default RestaurantDetails;