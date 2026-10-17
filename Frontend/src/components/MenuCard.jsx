import React, { memo, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { showToast } from "./Toast";
import { getOptimizedImageUrl } from "../utils/imageUtils";

function MenuCard({ item, onOpenModal, isManager = false, onEditPrice, onToggleAvailability, onDelete }) {
    const { addToCart, increaseQuantity, decreaseQuantity, getItemQuantity } = useCart();
    const itemId = item.itemId || item.menuItemId;
    const currentQty = getItemQuantity(itemId);

    const handleQuickAdd = useCallback((e) => {
        e.stopPropagation();
        addToCart(item, 1);
        showToast(`Added 1x ${item.itemName} to cart!`);
    }, [addToCart, item]);

    const handleIncrease = useCallback((e) => {
        e.stopPropagation();
        increaseQuantity(itemId);
    }, [increaseQuantity, itemId]);

    const handleDecrease = useCallback((e) => {
        e.stopPropagation();
        decreaseQuantity(itemId);
    }, [decreaseQuantity, itemId]);

    const optimizedImg = getOptimizedImageUrl(
        item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        400,
        80
    );

    return (
        <div
            className={`menu-card-item ${!item.availability ? "is-unavailable" : ""}`}
            onClick={() => onOpenModal && onOpenModal(item)}
        >
            <div className="menu-card-details">
                {/* VEG / NON-VEG BADGE */}
                <div className="menu-card-badges">
                    <span className={`veg-badge ${item.isVeg ? "veg" : "non-veg"}`}>
                        <span className="dot"></span> {item.isVeg ? "Veg" : "Non-Veg"}
                    </span>
                    {item.badge && <span className="menu-highlight-badge">{item.badge}</span>}
                </div>

                <h3 className="menu-item-name">{item.itemName}</h3>

                <div className="menu-price-row">
                    <span className="current-price">₹{item.price}</span>
                    {item.rating && (
                        <span className="item-rating">
                            ★ {item.rating}
                        </span>
                    )}
                </div>

                <p className="menu-item-desc">
                    {item.description || "Made fresh to order with authentic spices and chef's special preparation."}
                </p>

                {/* MANAGER ACTION BUTTONS (IF MANAGER MODE) */}
                {isManager && (
                    <div className="manager-actions-row" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="mgmt-btn edit"
                            onClick={() => onEditPrice && onEditPrice(itemId, item.price)}
                        >
                            ✏️ ₹{item.price}
                        </button>
                        <button
                            type="button"
                            className={`mgmt-btn ${item.availability ? "disable" : "enable"}`}
                            onClick={() => onToggleAvailability && onToggleAvailability(itemId, item.availability)}
                        >
                            {item.availability ? "Disable" : "Enable"}
                        </button>
                        <button
                            type="button"
                            className="mgmt-btn delete"
                            onClick={() => onDelete && onDelete(itemId)}
                        >
                            🗑️
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT THUMBNAIL & ADD BUTTON */}
            <div className="menu-card-media">
                <div className="menu-thumbnail-wrapper">
                    <img
                        src={optimizedImg}
                        alt={item.itemName}
                        className="menu-thumbnail-img"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.target.src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
                        }}
                    />
                    {!item.availability && (
                        <div className="unavailable-overlay">Currently Sold Out</div>
                    )}
                </div>

                {/* ADD / QUANTITY STEPPER BUTTON */}
                {!isManager && item.availability && (
                    <div className="menu-add-container" onClick={(e) => e.stopPropagation()}>
                        {currentQty > 0 ? (
                            <div className="card-stepper-btn">
                                <button type="button" onClick={handleDecrease} title="Decrease quantity">
                                    −
                                </button>
                                <span>{currentQty}</span>
                                <button type="button" onClick={handleIncrease} title="Increase quantity">
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="card-add-btn"
                                onClick={handleQuickAdd}
                            >
                                <span>ADD</span>
                                <span className="plus-sign">+</span>
                            </button>
                        )}
                        <span className="customisable-text" onClick={() => onOpenModal && onOpenModal(item)}>
                            Customisable
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(MenuCard);