import React, { memo, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { showToast } from "./Toast";

function OrderCard({ order, onTrack, onRate, onCancel }) {
    const { addToCart } = useCart();

    const normalizedStatus = String(order.status || "PLACED").toUpperCase();
    const canCancel =
        normalizedStatus !== "CANCELLED" &&
        normalizedStatus !== "DELIVERED" &&
        normalizedStatus !== "OUT_FOR_DELIVERY";

    const isDelivered = normalizedStatus === "DELIVERED";

    const handleReorder = useCallback(() => {
        if (order.orderitems && order.orderitems.length > 0) {
            order.orderitems.forEach((item) => {
                const idVal = item.menuitem?.itemId || item.menuitem?.menuItemId || Math.random();
                addToCart(
                    {
                        itemId: idVal,
                        menuItemId: idVal,
                        itemName: item.menuitem?.itemName || "Delicious Item",
                        price: item.menuitem?.price || item.subtotal / (item.quantity || 1),
                        isVeg: true
                    },
                    item.quantity || 1
                );
            });
            showToast("Added previous order items to your cart! 🛒", "success");
        }
    }, [addToCart, order.orderitems]);

    const restaurantTitle =
        order.restaurantName ||
        order.orderitems?.[0]?.menuitem?.restaurant?.restaurantName ||
        "Foodie Partner Kitchen";

    return (
        <div className="order-history-card">
            {/* CARD TOP */}
            <div className="order-history-header">
                <div className="order-vendor-info">
                    <div className="vendor-avatar">🍽️</div>
                    <div>
                        <h3 className="vendor-name">{restaurantTitle}</h3>
                        <div className="order-sub-meta">
                            <span>Order #{order.orderId}</span>
                            <span>•</span>
                            <span>{order.orderDateTime || "Recent"}</span>
                        </div>
                    </div>
                </div>

                <div className={`status-badge status-${normalizedStatus.toLowerCase()}`}>
                    {normalizedStatus === "PREPARING" && "🍳 "}
                    {normalizedStatus === "DELIVERED" && "✅ "}
                    {normalizedStatus === "CANCELLED" && "❌ "}
                    {normalizedStatus === "OUT_FOR_DELIVERY" && "🛵 "}
                    {order.status}
                </div>
            </div>

            {/* ITEMS LIST */}
            <div className="order-history-items">
                {order.orderitems?.map((item, idx) => (
                    <div key={item.orderItemsId || idx} className="order-history-row">
                        <div className="item-qty-name">
                            <span className="qty-pill">{item.quantity}x</span>
                            <span className="item-title">
                                {item.menuitem?.itemName || "Menu Item"}
                            </span>
                        </div>
                        <span className="item-row-price">
                            ₹{item.subtotal || Number(item.menuitem?.price || 0) * item.quantity}
                        </span>
                    </div>
                ))}
            </div>

            {/* CARD BOTTOM & ACTIONS */}
            <div className="order-history-footer">
                <div className="order-bill-summary">
                    <span className="total-label">Total Paid:</span>
                    <span className="total-val">₹{order.totalAmount}</span>
                </div>

                <div className="order-actions-group">
                    {/* LIVE TRACKER BUTTON */}
                    {normalizedStatus !== "CANCELLED" && (
                        <button
                            type="button"
                            className="order-action-btn track-btn"
                            onClick={() => onTrack && onTrack(order)}
                        >
                            🛵 Track Order
                        </button>
                    )}

                    {/* REORDER BUTTON */}
                    <button
                        type="button"
                        className="order-action-btn reorder-btn"
                        onClick={handleReorder}
                    >
                        🔄 Reorder
                    </button>

                    {/* RATE ORDER BUTTON */}
                    {isDelivered && (
                        <button
                            type="button"
                            className="order-action-btn rate-btn"
                            onClick={() => onRate && onRate(order)}
                        >
                            ⭐ Rate Meal
                        </button>
                    )}

                    {/* CANCEL BUTTON */}
                    {canCancel && (
                        <button
                            type="button"
                            className="order-action-btn cancel-btn"
                            onClick={() => onCancel && onCancel(order.orderId)}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(OrderCard);