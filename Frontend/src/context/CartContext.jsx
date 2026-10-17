import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { COUPONS } from "../data/mockData";
import { showToast } from "../components/Toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        if (!savedCart) return [];
        try {
            return JSON.parse(savedCart);
        } catch (error) {
            console.error("Invalid cart data", error);
            return [];
        }
    });

    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        const savedCoupon = localStorage.getItem("foodie_coupon");
        if (!savedCoupon) return null;
        try {
            return JSON.parse(savedCoupon);
        } catch {
            return null;
        }
    });

    const [deliveryTip, setDeliveryTip] = useState(20);

    // Save cart
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Save coupon
    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem("foodie_coupon", JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem("foodie_coupon");
        }
    }, [appliedCoupon]);

    // Add item with optional customizations
    const addToCart = useCallback((menuItem, quantity = 1) => {
        const idVal = menuItem.itemId || menuItem.menuItemId;
        const normalizedItem = {
            ...menuItem,
            itemId: idVal,
            menuItemId: idVal
        };

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (item) => (item.itemId === idVal || item.menuItemId === idVal) && item.portion === menuItem.portion
            );

            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                };
                return updated;
            }

            return [
                ...prevCart,
                {
                    ...normalizedItem,
                    quantity: quantity,
                    portion: menuItem.portion || "regular"
                }
            ];
        });
    }, []);

    const increaseQuantity = useCallback((idVal, portion = "regular") => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                (item.itemId === idVal || item.menuItemId === idVal) && (item.portion || "regular") === portion
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }, []);

    const decreaseQuantity = useCallback((idVal, portion = "regular") => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    (item.itemId === idVal || item.menuItemId === idVal) && (item.portion || "regular") === portion
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const getItemQuantity = useCallback((idVal) => {
        return cart
            .filter((item) => item.itemId === idVal || item.menuItemId === idVal)
            .reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const removeFromCart = useCallback((idVal, portion = "regular") => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !((item.itemId === idVal || item.menuItemId === idVal) && (item.portion || "regular") === portion)
            )
        );
        showToast("Item removed from cart", "info");
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        setAppliedCoupon(null);
        localStorage.removeItem("cart");
        localStorage.removeItem("foodie_coupon");
    }, []);

    // Calculate item subtotal
    const itemTotal = useMemo(() => {
        return cart.reduce(
            (total, item) => total + Number(item.price || 0) * item.quantity,
            0
        );
    }, [cart]);

    const totalItems = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    // Delivery Fee logic
    const deliveryFee = useMemo(() => {
        if (appliedCoupon?.code === "FREEDEL") return 0;
        return itemTotal > 300 || itemTotal === 0 ? 0 : 35;
    }, [appliedCoupon, itemTotal]);

    // Taxes & Restaurant Packaging charges (5% GST + Packaging)
    const taxesAndCharges = useMemo(() => {
        return itemTotal > 0 ? Math.round(itemTotal * 0.05 + 15) : 0;
    }, [itemTotal]);

    // Calculate coupon discount
    const discountAmount = useMemo(() => {
        if (!appliedCoupon || itemTotal < (appliedCoupon.minOrder || 0)) return 0;
        if (appliedCoupon.flatDiscount) {
            return appliedCoupon.flatDiscount;
        } else if (appliedCoupon.discountPercent) {
            const calculated = (itemTotal * appliedCoupon.discountPercent) / 100;
            return Math.min(calculated, appliedCoupon.maxDiscount || calculated);
        }
        return 0;
    }, [appliedCoupon, itemTotal]);

    // Final total calculation
    const finalAmount = useMemo(() => {
        return Math.max(
            0,
            Math.round(itemTotal + deliveryFee + taxesAndCharges + deliveryTip - discountAmount)
        );
    }, [itemTotal, deliveryFee, taxesAndCharges, deliveryTip, discountAmount]);

    const applyCoupon = useCallback((code) => {
        const uppercase = code.trim().toUpperCase();
        const found = COUPONS.find((c) => c.code === uppercase);

        if (!found) {
            showToast(`Coupon code "${code}" is invalid.`, "error");
            return false;
        }

        if (itemTotal < found.minOrder) {
            showToast(`Add ₹${found.minOrder - itemTotal} more to apply ${found.code}!`, "warning");
            return false;
        }

        setAppliedCoupon(found);
        showToast(`Coupon ${found.code} applied! Saved discount.`, "success");
        return true;
    }, [itemTotal]);

    const removeCoupon = useCallback(() => {
        setAppliedCoupon(null);
        showToast("Coupon removed", "info");
    }, []);

    const contextValue = useMemo(() => ({
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalItems,
        itemTotal,
        totalPrice: itemTotal,
        totalAmount: finalAmount,
        deliveryFee,
        taxesAndCharges,
        discountAmount,
        deliveryTip,
        setDeliveryTip,
        appliedCoupon,
        applyCoupon,
        removeCoupon
    }), [
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalItems,
        itemTotal,
        finalAmount,
        deliveryFee,
        taxesAndCharges,
        discountAmount,
        deliveryTip,
        appliedCoupon,
        applyCoupon,
        removeCoupon
    ]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};