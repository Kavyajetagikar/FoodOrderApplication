// src/pages/Orders.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderCard from "../components/OrderCard";
import OrderTrackerModal from "../components/OrderTrackerModal";
import RatingModal from "../components/RatingModal";
import { useCustomer } from "../context/CustomerContext";
import { getCustomerOrders, cancelOrder } from "../api/orderApi";
import { showToast } from "../components/Toast";

function Orders() {
    const { customer, localOrders, cancelLocalOrder } = useCustomer();
    const [orders, setOrders] = useState(localOrders || []);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState("ALL"); // 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'

    // Modals
    const [trackingOrder, setTrackingOrder] = useState(null);
    const [ratingOrder, setRatingOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [customer, localOrders]);

    const loadOrders = async () => {
        if (!customer) {
            setOrders(localOrders || []);
            return;
        }

        try {
            setLoading(true);
            const response = await getCustomerOrders(customer.customerId);
            if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
                setOrders(response.data.data);
            } else {
                setOrders(localOrders || []);
            }
        } catch (error) {
            console.log("Backend offline, showing local order history");
            setOrders(localOrders || []);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await cancelOrder(orderId);
            showToast(`Order #${orderId} cancelled in database.`, "info");
        } catch (error) {
            console.log("Order cancel notice:", error.message);
        }

        cancelLocalOrder(orderId);
        setOrders((prev) =>
            prev.map((o) => (o.orderId === orderId ? { ...o, status: "CANCELLED" } : o))
        );
    };

    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const status = String(o.status || "").toUpperCase();
            if (selectedTab === "ALL") return true;
            if (selectedTab === "ACTIVE") {
                return (
                    status === "PREPARING" ||
                    status === "CONFIRMED" ||
                    status === "PLACED" ||
                    status === "OUT_FOR_DELIVERY"
                );
            }
            if (selectedTab === "DELIVERED") return status === "DELIVERED";
            if (selectedTab === "CANCELLED") return status === "CANCELLED";
            return true;
        });
    }, [orders, selectedTab]);

    return (
        <div className="orders-page-wrapper">
            <Navbar />

            <main className="page-container orders-layout">
                <div className="orders-header-row">
                    <div>
                        <h1>My Orders & Tracking</h1>
                        <p>Track live deliveries, view past receipts, reorder meals, and rate your experiences</p>
                    </div>

                    <Link to="/restaurants" className="secondary-btn">
                        <span>🍽️</span> Order More Food
                    </Link>
                </div>

                {/* FILTER TABS */}
                <div className="orders-filter-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${selectedTab === "ALL" ? "active" : ""}`}
                        onClick={() => setSelectedTab("ALL")}
                    >
                        All Orders ({orders.length})
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${selectedTab === "ACTIVE" ? "active" : ""}`}
                        onClick={() => setSelectedTab("ACTIVE")}
                    >
                        ⚡ Active Deliveries
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${selectedTab === "DELIVERED" ? "active" : ""}`}
                        onClick={() => setSelectedTab("DELIVERED")}
                    >
                        ✅ Past Deliveries
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${selectedTab === "CANCELLED" ? "active" : ""}`}
                        onClick={() => setSelectedTab("CANCELLED")}
                    >
                        ❌ Cancelled
                    </button>
                </div>

                {/* ORDERS LIST */}
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading your orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="empty-orders-view">
                        <div className="empty-emoji">📦</div>
                        <h3>No orders in this category</h3>
                        <p>You haven't placed any orders matching this filter yet.</p>
                        <Link to="/restaurants" className="primary-btn">
                            Browse Restaurants & Order Now
                        </Link>
                    </div>
                ) : (
                    <div className="orders-cards-stack">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.orderId}
                                order={order}
                                onTrack={(ord) => setTrackingOrder(ord)}
                                onRate={(ord) => setRatingOrder(ord)}
                                onCancel={handleCancelOrder}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* LIVE TRACKER MODAL */}
            {trackingOrder && (
                <OrderTrackerModal
                    order={trackingOrder}
                    onClose={() => setTrackingOrder(null)}
                />
            )}

            {/* RATING MODAL */}
            {ratingOrder && (
                <RatingModal
                    order={ratingOrder}
                    onClose={() => setRatingOrder(null)}
                />
            )}

            <Footer />
        </div>
    );
}

export default Orders;