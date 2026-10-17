import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RestaurantCard from "../components/RestaurantCard";
import { getRestaurants } from "../api/restaurantApi";
import { INITIAL_RESTAURANTS, CUISINES } from "../data/mockData";
import useDebounce from "../hooks/useDebounce";

function Restaurants() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [allRestaurants, setAllRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const debouncedSearch = useDebounce(searchQuery, 250);
    const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get("cuisine") || "all");
    const [vegOnly, setVegOnly] = useState(false);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("rating"); // 'rating' | 'name' | 'fastest'

    const loadRestaurants = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getRestaurants();
            const apiData = response.data?.data;

            if (apiData && Array.isArray(apiData) && apiData.length > 0) {
                const merged = apiData.map((res, index) => {
                    const fallbackMatch =
                        INITIAL_RESTAURANTS.find((r) => r.resId === res.resId) ||
                        INITIAL_RESTAURANTS[index % INITIAL_RESTAURANTS.length];
                    return {
                        ...fallbackMatch,
                        ...res,
                        resId: res.resId || res.restaurantId || fallbackMatch.resId,
                        restaurantName: res.restaurantName || fallbackMatch.restaurantName,
                        location: res.location || fallbackMatch.location,
                        rating: res.rating || fallbackMatch.rating,
                        image: res.image || fallbackMatch.image,
                        cuisine: res.cuisine || fallbackMatch.cuisine,
                        deliveryTime: res.deliveryTime || fallbackMatch.deliveryTime,
                        priceForTwo: res.priceForTwo || fallbackMatch.priceForTwo
                    };
                });
                setAllRestaurants(merged);
            } else {
                setAllRestaurants(INITIAL_RESTAURANTS);
            }
        } catch (err) {
            console.log("Backend offline or empty, using sample restaurants data:", err.message);
            setAllRestaurants(INITIAL_RESTAURANTS);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRestaurants();
    }, [loadRestaurants]);

    // Sync query param if changed
    useEffect(() => {
        const q = searchParams.get("search");
        if (q !== null) setSearchQuery(q);

        const c = searchParams.get("cuisine");
        if (c !== null) setSelectedCuisine(c);
    }, [searchParams]);

    // Filter and sort calculation
    const filteredRestaurants = useMemo(() => {
        return allRestaurants
            .filter((res) => {
                // Search query match
                if (debouncedSearch.trim()) {
                    const q = debouncedSearch.toLowerCase();
                    const nameMatch = (res.restaurantName || "").toLowerCase().includes(q);
                    const locMatch = (res.location || "").toLowerCase().includes(q);
                    const cuisineMatch = (res.cuisine || "").toLowerCase().includes(q);
                    const menuMatch = res.menu?.some((m) =>
                        m.itemName.toLowerCase().includes(q)
                    );
                    if (!nameMatch && !locMatch && !cuisineMatch && !menuMatch) return false;
                }

                // Cuisine filter
                if (selectedCuisine && selectedCuisine !== "all") {
                    const tagMatch = res.tags?.includes(selectedCuisine.toLowerCase());
                    const textMatch = (res.cuisine || "").toLowerCase().includes(selectedCuisine.toLowerCase());
                    if (!tagMatch && !textMatch) return false;
                }

                // Veg only filter
                if (vegOnly && !res.isPureVeg) {
                    return false;
                }

                // Rating filter
                if (minRating > 0 && (res.rating || 0) < minRating) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
                if (sortBy === "name") return (a.restaurantName || "").localeCompare(b.restaurantName || "");
                if (sortBy === "fastest") return parseInt(a.deliveryTime || "30") - parseInt(b.deliveryTime || "30");
                return 0;
            });
    }, [allRestaurants, debouncedSearch, selectedCuisine, vegOnly, minRating, sortBy]);

    const resetFilters = useCallback(() => {
        setSearchQuery("");
        setSelectedCuisine("all");
        setVegOnly(false);
        setMinRating(0);
        setSortBy("rating");
        setSearchParams({});
    }, [setSearchParams]);

    const hasActiveFilters =
        Boolean(searchQuery) ||
        selectedCuisine !== "all" ||
        vegOnly ||
        minRating > 0 ||
        sortBy !== "rating";

    return (
        <div className="restaurants-page-wrapper">
            <Navbar />

            <main className="restaurants-main-container">
                {/* PAGE HEADER */}
                <div className="restaurants-page-header">
                    <div className="header-titles">
                        <h1>Explore Restaurants</h1>
                        <p>Find the best food spots, top cuisines, and daily offers in your neighborhood</p>
                    </div>

                    <Link to="/add-restaurant" className="primary-btn add-res-btn">
                        <span>➕</span> Add Restaurant
                    </Link>
                </div>

                {/* INTERACTIVE FILTER & SEARCH BAR */}
                <div className="interactive-filter-bar">
                    {/* SEARCH INPUT */}
                    <div className="filter-search-box">
                        <span className="filter-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by restaurant name, dish, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="search-clear-btn"
                                onClick={() => setSearchQuery("")}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* CONTROLS ROW */}
                    <div className="filter-controls-row">
                        {/* VEG ONLY TOGGLE */}
                        <button
                            type="button"
                            className={`filter-pill-btn ${vegOnly ? "active-veg" : ""}`}
                            onClick={() => setVegOnly(!vegOnly)}
                        >
                            🌱 Veg Only
                        </button>

                        {/* RATING 4.0+ */}
                        <button
                            type="button"
                            className={`filter-pill-btn ${minRating === 4 ? "active" : ""}`}
                            onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
                        >
                            ⭐ Ratings 4.0+
                        </button>

                        {/* SORT DROPDOWN */}
                        <div className="sort-dropdown-wrapper">
                            <span className="sort-label">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="rating">Top Rated (Default)</option>
                                <option value="fastest">Fastest Delivery</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>

                        {/* RESET BUTTON */}
                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="filter-reset-btn"
                                onClick={resetFilters}
                            >
                                ✕ Reset Filters
                            </button>
                        )}
                    </div>

                    {/* CUISINE FILTER CHIPS */}
                    <div className="cuisine-filter-chips">
                        {CUISINES.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className={`cuisine-chip ${selectedCuisine === c.id ? "selected" : ""}`}
                                onClick={() => setSelectedCuisine(c.id)}
                            >
                                <span className="chip-icon">{c.icon}</span>
                                <span className="chip-name">{c.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* RESULTS HEADER & COUNT */}
                <div className="results-count-bar">
                    <h2>
                        {selectedCuisine !== "all"
                            ? `${CUISINES.find((c) => c.id === selectedCuisine)?.name || selectedCuisine} Places`
                            : "All Restaurants"}
                        <span className="count-badge">({filteredRestaurants.length})</span>
                    </h2>
                </div>

                {/* LOADING SKELETON */}
                {loading && (
                    <div className="loading-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton-img"></div>
                                <div className="skeleton-line full"></div>
                                <div className="skeleton-line half"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && filteredRestaurants.length === 0 && (
                    <div className="empty-results-box">
                        <div className="empty-icon">🍽️</div>
                        <h3>No restaurants match your search</h3>
                        <p>Try clearing some filters or searching for another dish or cuisine.</p>
                        <button type="button" className="primary-btn" onClick={resetFilters}>
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* RESTAURANTS GRID */}
                {!loading && filteredRestaurants.length > 0 && (
                    <div className="restaurants-display-grid">
                        {filteredRestaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.resId} restaurant={restaurant} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Restaurants;