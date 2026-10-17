import React, { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";
import { getOptimizedImageUrl } from "../utils/imageUtils";

function RestaurantCard({ restaurant }) {
    const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useCustomer();
    const isFav = isFavoriteRestaurant(restaurant.resId);

    const handleFavClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavoriteRestaurant(restaurant.resId);
    }, [restaurant.resId, toggleFavoriteRestaurant]);

    const optimizedImg = getOptimizedImageUrl(
        restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        500,
        80
    );

    return (
        <div className="restaurant-card">
            <Link to={`/restaurant/${restaurant.resId}`} className="restaurant-card-link">
                {/* IMAGE CONTAINER */}
                <div className="restaurant-image-wrapper">
                    <img
                        src={optimizedImg}
                        alt={restaurant.restaurantName}
                        className="restaurant-img"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.target.src =
                                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80";
                        }}
                    />

                    {/* TOP BADGES */}
                    <div className="card-top-badges">
                        {restaurant.offer && (
                            <span className="offer-badge">🏷️ {restaurant.offer}</span>
                        )}
                        {restaurant.isPureVeg && (
                            <span className="pure-veg-badge">🌱 Pure Veg</span>
                        )}
                    </div>

                    {/* FAVORITE BUTTON */}
                    <button
                        type="button"
                        className={`fav-button ${isFav ? "active" : ""}`}
                        onClick={handleFavClick}
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        {isFav ? "❤️" : "🤍"}
                    </button>

                    {/* DELIVERY TIME PILL */}
                    <div className="delivery-time-pill">
                        ⏱️ {restaurant.deliveryTime || "25-30 min"}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="restaurant-info">
                    <div className="restaurant-title-row">
                        <h3 className="restaurant-name">{restaurant.restaurantName}</h3>
                        <div className="rating-pill">
                            <span className="star">★</span>
                            <span className="rating-num">
                                {restaurant.rating ? Number(restaurant.rating).toFixed(1) : "4.5"}
                            </span>
                        </div>
                    </div>

                    <p className="restaurant-cuisine">
                        {restaurant.cuisine || "North Indian, Fast Food, Chinese"}
                    </p>

                    <div className="restaurant-meta-row">
                        <span className="meta-location">
                            📍 {restaurant.location || "Central Area"}
                        </span>
                        <span className="meta-dot">•</span>
                        <span className="meta-price">
                            {restaurant.priceForTwo || "₹350 for two"}
                        </span>
                    </div>

                    <div className="restaurant-card-footer">
                        <span className="view-menu-text">View Menu</span>
                        <span className="arrow-icon">→</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default memo(RestaurantCard);