import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { INITIAL_ORDERS } from "../data/mockData";
import { showToast } from "../components/Toast";

const CustomerContext = createContext();

const DEFAULT_ADDRESSES = [
    {
        id: "addr-1",
        title: "Home",
        tag: "Home",
        address: "Flat 402, Sunshine Heights, MG Road",
        phone: "9876543210",
        isDefault: true
    },
    {
        id: "addr-2",
        title: "Office / Work",
        tag: "Work",
        address: "Tech Park Block 4, 3rd Floor, Indiranagar",
        phone: "9876543210",
        isDefault: false
    }
];

export const CustomerProvider = ({ children }) => {
    // Current logged in customer
    const [customer, setCustomer] = useState(() => {
        const saved = localStorage.getItem("customer");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return null;
            }
        }
        // Default guest/demo user for instant access
        return {
            customerId: 1,
            customerName: "Alex Morgan",
            email: "alex.morgan@foodie.com",
            phone: "9876543210",
            address: "Flat 402, Sunshine Heights, MG Road"
        };
    });

    // Wishlist favorites (array of IDs)
    const [favoriteRestaurants, setFavoriteRestaurants] = useState(() => {
        const saved = localStorage.getItem("foodie_fav_restaurants");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [1, 2];
            }
        }
        return [1, 2]; // Default favorite 1 and 2
    });

    // Saved delivery addresses
    const [savedAddresses, setSavedAddresses] = useState(() => {
        const saved = localStorage.getItem("foodie_addresses");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return DEFAULT_ADDRESSES;
            }
        }
        return DEFAULT_ADDRESSES;
    });

    // Orders state (local / backend hybrid)
    const [localOrders, setLocalOrders] = useState(() => {
        const saved = localStorage.getItem("foodie_orders");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return INITIAL_ORDERS;
            }
        }
        return INITIAL_ORDERS;
    });

    // Sync to local storage
    useEffect(() => {
        if (customer) {
            localStorage.setItem("customer", JSON.stringify(customer));
            localStorage.setItem("customerId", customer.customerId);
        } else {
            localStorage.removeItem("customer");
            localStorage.removeItem("customerId");
        }
    }, [customer]);

    useEffect(() => {
        localStorage.setItem("foodie_fav_restaurants", JSON.stringify(favoriteRestaurants));
    }, [favoriteRestaurants]);

    useEffect(() => {
        localStorage.setItem("foodie_addresses", JSON.stringify(savedAddresses));
    }, [savedAddresses]);

    useEffect(() => {
        localStorage.setItem("foodie_orders", JSON.stringify(localOrders));
    }, [localOrders]);

    // Actions memoized with useCallback
    const loginCustomer = useCallback((customerData) => {
        setCustomer(customerData);
        showToast(`Welcome back, ${customerData.customerName || "Foodie"}!`, "success");
    }, []);

    const logoutCustomer = useCallback(() => {
        setCustomer(null);
        showToast("Logged out successfully.", "info");
    }, []);

    const loginAsDemoUser = useCallback(() => {
        const demoUser = {
            customerId: 1,
            customerName: "Alex Morgan",
            email: "alex.morgan@foodie.com",
            phone: "9876543210",
            address: "Flat 402, Sunshine Heights, MG Road"
        };
        loginCustomer(demoUser);
    }, [loginCustomer]);

    const loginAsDemoManager = useCallback(() => {
        const demoManager = {
            customerId: 99,
            customerName: "Chef Antonio (Manager)",
            email: "manager@foodie.com",
            phone: "9988776655",
            address: "Indiranagar Kitchen Hub",
            isManager: true
        };
        loginCustomer(demoManager);
    }, [loginCustomer]);

    const toggleFavoriteRestaurant = useCallback((resId) => {
        const idNum = Number(resId);
        setFavoriteRestaurants((prev) => {
            if (prev.includes(idNum)) {
                showToast("Removed from Favorites", "info");
                return prev.filter((id) => id !== idNum);
            } else {
                showToast("Added to Favorites ❤️", "success");
                return [...prev, idNum];
            }
        });
    }, []);

    const isFavoriteRestaurant = useCallback((resId) => {
        return favoriteRestaurants.includes(Number(resId));
    }, [favoriteRestaurants]);

    const addAddress = useCallback((newAddr) => {
        setSavedAddresses((prev) => {
            const addrObj = {
                ...newAddr,
                id: `addr-${Date.now()}`,
                isDefault: prev.length === 0
            };
            return [...prev, addrObj];
        });
        showToast("Address saved successfully!", "success");
    }, []);

    const deleteAddress = useCallback((id) => {
        setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
        showToast("Address deleted.", "info");
    }, []);

    const addLocalOrder = useCallback((orderData) => {
        const newOrder = {
            ...orderData,
            orderId: Math.floor(1000 + Math.random() * 9000),
            orderDateTime: "Just Now",
            status: "PREPARING"
        };
        setLocalOrders((prev) => [newOrder, ...prev]);
        return newOrder;
    }, []);

    const cancelLocalOrder = useCallback((orderId) => {
        setLocalOrders((prev) =>
            prev.map((o) => (o.orderId === orderId ? { ...o, status: "CANCELLED" } : o))
        );
        showToast(`Order #${orderId} has been cancelled.`, "info");
    }, []);

    const contextValue = useMemo(() => ({
        customer,
        loginCustomer,
        logoutCustomer,
        loginAsDemoUser,
        loginAsDemoManager,
        favoriteRestaurants,
        toggleFavoriteRestaurant,
        isFavoriteRestaurant,
        savedAddresses,
        addAddress,
        deleteAddress,
        localOrders,
        addLocalOrder,
        cancelLocalOrder
    }), [
        customer,
        loginCustomer,
        logoutCustomer,
        loginAsDemoUser,
        loginAsDemoManager,
        favoriteRestaurants,
        toggleFavoriteRestaurant,
        isFavoriteRestaurant,
        savedAddresses,
        addAddress,
        deleteAddress,
        localOrders,
        addLocalOrder,
        cancelLocalOrder
    ]);

    return (
        <CustomerContext.Provider value={contextValue}>
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => {
    return useContext(CustomerContext);
};