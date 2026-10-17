import React, { memo } from "react";
import { useCart } from "../context/CartContext";
import { getOptimizedImageUrl } from "../utils/imageUtils";

function CartItem({ item }) {
    const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
    const portionKey = item.portion || "regular";
    const itemId = item.itemId || item.menuItemId;

    const optimizedImg = getOptimizedImageUrl(
        item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        200,
        80
    );

    return (
        <div className="cart-item-row">
            {/* THUMBNAIL */}
            <div className="cart-item-thumb">
                <img
                    src={optimizedImg}
                    alt={item.itemName}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.target.src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80";
                    }}
                />
            </div>

            {/* DETAILS */}
            <div className="cart-item-details">
                <div className="cart-item-top">
                    <span className={`veg-badge mini ${item.isVeg ? "veg" : "non-veg"}`}>
                        <span className="dot"></span>
                    </span>
                    <h4 className="cart-item-name">{item.itemName}</h4>
                </div>

                {/* PORTION & CUSTOMIZATIONS */}
                <div className="cart-customizations">
                    {item.portion === "large" && (
                        <span className="custom-pill">Large Portion</span>
                    )}
                    {item.selectedAddOns?.map((addon, i) => (
                        <span key={i} className="custom-pill addon">
                            +{addon}
                        </span>
                    ))}
                    {item.instructions && (
                        <p className="cart-instructions">
                            📝 Note: {item.instructions}
                        </p>
                    )}
                </div>

                <div className="cart-unit-price">
                    ₹{item.price} each
                </div>
            </div>

            {/* STEPPER & TOTAL */}
            <div className="cart-item-actions">
                <div className="quantity-stepper mini">
                    <button
                        type="button"
                        onClick={() => decreaseQuantity(itemId, portionKey)}
                        title="Decrease"
                    >
                        −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                        type="button"
                        onClick={() => increaseQuantity(itemId, portionKey)}
                        title="Increase"
                    >
                        +
                    </button>
                </div>

                <div className="cart-item-total">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                </div>

                <button
                    type="button"
                    className="cart-delete-btn"
                    onClick={() => removeFromCart(itemId, portionKey)}
                    title="Remove item"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default memo(CartItem);