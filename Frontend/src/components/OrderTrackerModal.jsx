// src/components/OrderTrackerModal.jsx
import React, { useState, useEffect } from "react";

const STAGES = [
    { key: "PLACED", label: "Order Placed", desc: "We have received your order", icon: "📝" },
    { key: "CONFIRMED", label: "Restaurant Confirmed", desc: "The kitchen accepted your order", icon: "👨‍🍳" },
    { key: "PREPARING", label: "Preparing in Kitchen", desc: "Fresh ingredients being cooked", icon: "🍳" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Valet on the way with your food", icon: "🛵" },
    { key: "DELIVERED", label: "Delivered", desc: "Enjoy your hot meal!", icon: "🎉" }
];

function OrderTrackerModal({ order, onClose }) {
    const [currentStep, setCurrentStep] = useState(2); // default preparing
    const [timeLeft, setTimeLeft] = useState(24);

    useEffect(() => {
        if (!order) return;
        const normalized = String(order.status || "").toUpperCase();
        if (normalized === "PLACED" || normalized === "PENDING") setCurrentStep(0);
        else if (normalized === "CONFIRMED") setCurrentStep(1);
        else if (normalized === "PREPARING") setCurrentStep(2);
        else if (normalized === "OUT_FOR_DELIVERY" || normalized === "ON_THE_WAY") setCurrentStep(3);
        else if (normalized === "DELIVERED") {
            setCurrentStep(4);
            setTimeLeft(0);
        }
    }, [order]);

    // Timer simulation
    useEffect(() => {
        if (currentStep >= 4) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 1 ? prev - 1 : 1));
        }, 15000);
        return () => clearInterval(timer);
    }, [currentStep]);

    if (!order) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content tracker-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <div className="tracker-header">
                    <div className="tracker-badge">Live Tracking</div>
                    <h2>Order #{order.orderId}</h2>
                    <p className="tracker-restaurant">{order.restaurantName || "Restaurant Partner"}</p>
                    
                    {currentStep < 4 ? (
                        <div className="eta-card">
                            <span className="eta-icon">⏱️</span>
                            <div>
                                <div className="eta-title">Estimated Delivery In</div>
                                <div className="eta-time">{timeLeft} Mins</div>
                            </div>
                        </div>
                    ) : (
                        <div className="eta-card delivered">
                            <span className="eta-icon">🎉</span>
                            <div>
                                <div className="eta-title">Status</div>
                                <div className="eta-time">Delivered Safely</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Visual Tracker */}
                <div className="tracking-timeline">
                    {STAGES.map((stage, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                            <div key={stage.key} className={`timeline-item ${isDone ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
                                <div className="timeline-marker">
                                    <span className="marker-icon">{stage.icon}</span>
                                    {idx < STAGES.length - 1 && <div className="timeline-connector"></div>}
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-title">
                                        {stage.label}
                                        {isCurrent && <span className="pulsing-dot"></span>}
                                    </div>
                                    <p className="timeline-desc">{stage.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Valet / Delivery Partner Info */}
                <div className="valet-card">
                    <div className="valet-avatar">🛵</div>
                    <div className="valet-info">
                        <div className="valet-name">Rahul Sharma (Delivery Partner)</div>
                        <div className="valet-rating">⭐ 4.9 (Vaccinated & Sanitized)</div>
                    </div>
                    <button className="call-btn" onClick={() => alert("Connecting call to Delivery Partner...")}>
                        📞 Call
                    </button>
                </div>

                {/* Destination */}
                <div className="delivery-dest">
                    <span>📍</span>
                    <div>
                        <strong>Delivering to:</strong>
                        <p>{order.deliveryAddress || "Your Selected Delivery Address"}</p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="primary-btn w-full" onClick={onClose}>
                        Close Tracker
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderTrackerModal;
