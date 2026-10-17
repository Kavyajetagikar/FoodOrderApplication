// src/components/ItemCustomizationModal.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { showToast } from "./Toast";

const ADD_ONS = [
    { id: "extra_cheese", name: "Extra Melted Cheese", price: 35 },
    { id: "spicy_dip", name: "Spicy Peri-Peri Dip", price: 25 },
    { id: "extra_sauce", name: "House Special Herb Sauce", price: 20 },
    { id: "coke_can", name: "Chilled Coca Cola (300ml)", price: 40 }
];

function ItemCustomizationModal({ item, onClose }) {
    const { addToCart } = useCart();
    const [portion, setPortion] = useState("regular");
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [instructions, setInstructions] = useState("");
    const [quantity, setQuantity] = useState(1);

    if (!item) return null;

    const portionPriceDelta = portion === "large" ? 60 : 0;
    const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
        const found = ADD_ONS.find((a) => a.id === addOnId);
        return sum + (found ? found.price : 0);
    }, 0);

    const unitPrice = Number(item.price) + portionPriceDelta + addOnsTotal;
    const totalPrice = unitPrice * quantity;

    const toggleAddOn = (id) => {
        if (selectedAddOns.includes(id)) {
            setSelectedAddOns(selectedAddOns.filter((x) => x !== id));
        } else {
            setSelectedAddOns([...selectedAddOns, id]);
        }
    };

    const handleAddToCart = () => {
        const idVal = item.itemId || item.menuItemId;
        const customizedItem = {
            ...item,
            itemId: idVal,
            menuItemId: idVal,
            price: unitPrice,
            portion,
            selectedAddOns: selectedAddOns.map((id) => ADD_ONS.find((a) => a.id === id)?.name),
            instructions: instructions.trim()
        };

        addToCart(customizedItem, quantity);
        showToast(`Added ${quantity}x ${item.itemName} to cart!`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content dish-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <div className="modal-image-container">
                    <img
                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
                        alt={item.itemName}
                        className="modal-dish-image"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
                        }}
                    />
                    {item.badge && <span className="modal-badge">{item.badge}</span>}
                </div>

                <div className="modal-body">
                    <div className="dish-modal-header">
                        <div>
                            <div className="dish-tags">
                                <span className={`veg-badge ${item.isVeg ? "veg" : "non-veg"}`}>
                                    <span className="dot"></span> {item.isVeg ? "Veg" : "Non-Veg"}
                                </span>
                                {item.category && <span className="category-pill">{item.category}</span>}
                            </div>
                            <h2>{item.itemName}</h2>
                            <p className="dish-description">{item.description || "Prepared fresh with supreme ingredients and signature spices."}</p>
                        </div>
                    </div>

                    <div className="customization-section">
                        <h4>Choose Portion Size</h4>
                        <div className="option-grid">
                            <label className={`option-card ${portion === "regular" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="portion"
                                    checked={portion === "regular"}
                                    onChange={() => setPortion("regular")}
                                />
                                <div>
                                    <span className="option-name">Regular</span>
                                    <span className="option-price">₹{item.price}</span>
                                </div>
                            </label>
                            <label className={`option-card ${portion === "large" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="portion"
                                    checked={portion === "large"}
                                    onChange={() => setPortion("large")}
                                />
                                <div>
                                    <span className="option-name">Large Portion</span>
                                    <span className="option-price">+₹60</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="customization-section">
                        <h4>Recommended Add-ons</h4>
                        <div className="addons-list">
                            {ADD_ONS.map((addOn) => (
                                <label key={addOn.id} className="addon-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedAddOns.includes(addOn.id)}
                                        onChange={() => toggleAddOn(addOn.id)}
                                    />
                                    <span className="addon-name">{addOn.name}</span>
                                    <span className="addon-price">+₹{addOn.price}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="customization-section">
                        <h4>Cooking & Delivery Notes</h4>
                        <input
                            type="text"
                            placeholder="E.g., Less spicy, extra napkins, cutlery required..."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="notes-input"
                            maxLength="100"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <div className="quantity-stepper">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                        >
                            −
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>
                            +
                        </button>
                    </div>

                    <button className="add-cart-large-btn" onClick={handleAddToCart}>
                        <span>Add Item</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemCustomizationModal;
