import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RestaurantCard from "../components/RestaurantCard";
import { useCustomer } from "../context/CustomerContext";
import { getRestaurants } from "../api/restaurantApi";
import { INITIAL_RESTAURANTS } from "../data/mockData";

function Favorites() {
    const { favoriteRestaurants } = useCustomer();
    const [allRestaurants, setAllRestaurants] = useState(INITIAL_RESTAURANTS);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await getRestaurants();
                if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
                    const merged = response.data.data.map((res, index) => {
                        const fallbackMatch =
                            INITIAL_RESTAURANTS.find((r) => r.resId === res.resId) ||
                            INITIAL_RESTAURANTS[index % INITIAL_RESTAURANTS.length];
                        return {
                            ...fallbackMatch,
                            ...res,
                            resId: res.resId || res.restaurantId || fallbackMatch.resId,
                            restaurantName: res.restaurantName || fallbackMatch.restaurantName,
                            location: res.location || fallbackMatch.location,
                            rating: res.rating || fallbackMatch.rating
                        };
                    });
                    setAllRestaurants(merged);
                }
            } catch {
                setAllRestaurants(INITIAL_RESTAURANTS);
            }
        };
        fetchAll();
    }, []);

    const favList = allRestaurants.filter((r) =>
        favoriteRestaurants.includes(Number(r.resId))
    );

    return (
        <div className="favorites-page-wrapper">
            <Navbar />

            <main className="page-container favorites-layout">
                <div className="favorites-header-bar">
                    <div>
                        <h1>My Saved Favorites ❤️</h1>
                        <p>Your curated collection of beloved restaurants and go-to culinary cravings</p>
                    </div>

                    <Link to="/restaurants" className="secondary-btn">
                        <span>🔍</span> Explore More Places
                    </Link>
                </div>

                {favList.length === 0 ? (
                    <div className="empty-favorites-box">
                        <div className="empty-heart-icon">🤍</div>
                        <h2>No Favorites Saved Yet</h2>
                        <p>
                            Tap the heart icon on any restaurant card to save your top favorites here for quick 1-click access!
                        </p>
                        <Link to="/restaurants" className="primary-btn">
                            Explore Restaurants Now
                        </Link>
                    </div>
                ) : (
                    <div className="restaurants-display-grid">
                        {favList.map((restaurant) => (
                            <RestaurantCard key={restaurant.resId} restaurant={restaurant} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Favorites;
