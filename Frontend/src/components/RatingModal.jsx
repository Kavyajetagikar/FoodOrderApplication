// src/components/RatingModal.jsx
import React, { useState } from "react";
import { showToast } from "./Toast";

const TAGS = [
    "🔥 Hot & Fresh",
    "⚡ Super Fast Delivery",
    "😋 Delicious Taste",
    "🍱 Great Packaging",
    "💰 Value for Money"
];

function RatingModal({ order, onClose }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);
    const [comment, setComment] = useState("");

    if (!order) return null;

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast(`Thank you for rating Order #${order.orderId}! ⭐ ${rating}/5`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content rating-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <div className="rating-modal-header">
                    <div className="rating-icon">⭐</div>
                    <h2>Rate Your Meal</h2>
                    <p>{order.restaurantName || `Order #${order.orderId}`}</p>
                </div>

                <form onSubmit={handleSubmit} className="rating-form">
                    <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star-btn ${(hoverRating || rating) >= star ? "filled" : ""}`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <p className="rating-caption">
                        {rating === 5 && "😍 Absolutely Loved It!"}
                        {rating === 4 && "😋 Very Good!"}
                        {rating === 3 && "🙂 Decent & Average"}
                        {rating === 2 && "😕 Could Be Better"}
                        {rating === 1 && "😞 Very Disappointed"}
                    </p>

                    <div className="tags-section">
                        <h4>What made it special?</h4>
                        <div className="tags-chips">
                            {TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`tag-chip ${selectedTags.includes(tag) ? "selected" : ""}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <textarea
                            placeholder="Write your feedback or review (optional)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="3"
                            className="review-textarea"
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="secondary-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn">
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RatingModal;
