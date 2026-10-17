// src/pages/Cart.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { COUPONS } from "../data/mockData";

function Cart() {
    const navigate = useNavigate();
    const {
        cart,
        clearCart,
        totalItems,
        itemTotal,
        totalAmount,
        deliveryFee,
        taxesAndCharges,
        discountAmount,
        deliveryTip,
        setDeliveryTip,
        appliedCoupon,
        applyCoupon,
        removeCoupon
    } = useCart();

    const [couponInput, setCouponInput] = useState("");
    const [cookingNote, setCookingNote] = useState("");

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (couponInput.trim()) {
            applyCoupon(couponInput.trim());
            setCouponInput("");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page-wrapper">
                <Navbar />
                <main className="page-container empty-cart-view">
                    <div className="empty-cart-card">
                        <div className="empty-cart-art">🛒</div>
                        <h2>Your Cart is Empty</h2>
                        <p>Good food is always cooking! Go ahead, explore top restaurants and order your favorites.</p>
                        <Link to="/restaurants" className="primary-btn see-restaurants-btn">
                            Explore Restaurants →
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <Navbar />

            <main className="page-container cart-main-layout">
                {/* HEADER */}
                <div className="cart-header-row">
                    <div>
                        <h1>Shopping Cart</h1>
                        <p className="cart-subtitle">
                            Review your items and proceed to fast checkout
                        </p>
                    </div>
                    <button
                        type="button"
                        className="clear-cart-text-btn"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear your cart?")) {
                                clearCart();
                            }
                        }}
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="cart-grid-columns">
                    {/* LEFT COLUMN: ITEMS & NOTES */}
                    <div className="cart-left-col">
                        <div className="cart-box items-box">
                            <div className="box-header">
                                <h3>
                                    Order Items <span className="items-count-badge">({totalItems})</span>
                                </h3>
                            </div>

                            <div className="cart-items-stack">
                                {cart.map((item) => (
                                    <CartItem key={`${item.menuItemId}-${item.portion || "reg"}`} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* SPECIAL INSTRUCTIONS */}
                        <div className="cart-box instructions-box">
                            <h4>📝 Cooking & Delivery Instructions</h4>
                            <input
                                type="text"
                                placeholder="E.g., Ring bell twice, deliver at security, less spicy..."
                                value={cookingNote}
                                onChange={(e) => setCookingNote(e.target.value)}
                                className="cart-notes-field"
                            />
                        </div>

                        {/* DELIVERY TIP SELECTOR */}
                        <div className="cart-box tip-box">
                            <div className="tip-header">
                                <h4>🚴 Delivery Partner Tip</h4>
                                <small>100% of this tip goes to your delivery partner</small>
                            </div>
                            <div className="tip-options-row">
                                {[0, 20, 30, 50, 100].map((tip) => (
                                    <button
                                        key={tip}
                                        type="button"
                                        className={`tip-btn ${deliveryTip === tip ? "active" : ""}`}
                                        onClick={() => setDeliveryTip(tip)}
                                    >
                                        {tip === 0 ? "No Tip" : `₹${tip}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: COUPONS & BILL BREAKDOWN */}
                    <div className="cart-right-col">
                        {/* PROMO COUPONS SECTION */}
                        <div className="cart-box coupons-box">
                            <div className="box-header">
                                <h3>🏷️ Apply Promo Code</h3>
                            </div>

                            {appliedCoupon ? (
                                <div className="applied-coupon-card">
                                    <div>
                                        <span className="applied-code">{appliedCoupon.code}</span>
                                        <p className="applied-desc">
                                            {appliedCoupon.description} (Saved ₹{discountAmount})
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="coupon-remove-btn"
                                        onClick={removeCoupon}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <form onSubmit={handleApplyCoupon} className="coupon-form">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code (e.g. FOODIE50)"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            className="coupon-input"
                                        />
                                        <button type="submit" className="apply-btn">
                                            Apply
                                        </button>
                                    </form>

                                    <div className="available-coupons-list">
                                        <small className="avail-title">Available Coupons:</small>
                                        {COUPONS.map((c) => (
                                            <div key={c.code} className="coupon-mini-card">
                                                <div>
                                                    <strong>{c.code}</strong>
                                                    <p>{c.description}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="mini-apply-btn"
                                                    onClick={() => applyCoupon(c.code)}
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* BILL DETAILS */}
                        <div className="cart-box bill-summary-box">
                            <div className="box-header">
                                <h3>Bill Details</h3>
                            </div>

                            <div className="bill-rows-list">
                                <div className="bill-row">
                                    <span>Item Total</span>
                                    <span>₹{itemTotal.toFixed(2)}</span>
                                </div>

                                <div className="bill-row">
                                    <span>
                                        Delivery Partner Fee
                                        {deliveryFee === 0 && <span className="free-tag">FREE</span>}
                                    </span>
                                    <span>{deliveryFee === 0 ? "₹0" : `₹${deliveryFee}`}</span>
                                </div>

                                <div className="bill-row">
                                    <span>Taxes & Restaurant Packaging</span>
                                    <span>₹{taxesAndCharges}</span>
                                </div>

                                {deliveryTip > 0 && (
                                    <div className="bill-row">
                                        <span>Delivery Tip</span>
                                        <span>₹{deliveryTip}</span>
                                    </div>
                                )}

                                {discountAmount > 0 && (
                                    <div className="bill-row discount-row">
                                        <span>Coupon Discount ({appliedCoupon?.code})</span>
                                        <span>−₹{discountAmount}</span>
                                    </div>
                                )}

                                <div className="bill-divider"></div>

                                <div className="bill-row total-row">
                                    <strong>To Pay</strong>
                                    <strong>₹{totalAmount.toFixed(2)}</strong>
                                </div>
                            </div>

                            {/* PROCEED BUTTON */}
                            <button
                                type="button"
                                className="primary-btn checkout-cta-btn"
                                onClick={() => navigate("/checkout")}
                            >
                                <span>Proceed to Checkout</span>
                                <span>₹{totalAmount.toFixed(2)} →</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Cart;