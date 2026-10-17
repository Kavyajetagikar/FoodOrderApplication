// src/api/restaurantApi.js
import api from "./axios";
import apiCache from "./cache";

// ===============================
// GET ALL RESTAURANTS
// GET /restaurant
// ===============================
export const getRestaurants = () =>
    apiCache.getOrFetch("/restaurant", () => api.get("/restaurant"), 30000);

export const getAllRestaurants = getRestaurants;

// ===============================
// GET RESTAURANT BY ID
// GET /restaurant/{id}
// ===============================
export const getRestaurantById = (id) =>
    apiCache.getOrFetch(`/restaurant/${id}`, () => api.get(`/restaurant/${id}`), 45000);

// ===============================
// ADD RESTAURANT
// POST /restaurant
// ===============================
export const addRestaurant = async (restaurant) => {
    const res = await api.post("/restaurant", restaurant);
    apiCache.invalidate("/restaurant");
    return res;
};

// ===============================
// UPDATE RESTAURANT
// PUT /restaurant/{id}
// ===============================
export const updateRestaurant = async (id, restaurant) => {
    const res = await api.put(`/restaurant/${id}`, restaurant);
    apiCache.invalidate("/restaurant");
    return res;
};

// ===============================
// DELETE RESTAURANT
// DELETE /restaurant/{id}
// ===============================
export const deleteRestaurant = async (id) => {
    const res = await api.delete(`/restaurant/${id}`);
    apiCache.invalidate("/restaurant");
    return res;
};

// ===============================
// SORT RESTAURANTS BY RATING
// GET /restaurant/sort/rating
// ===============================
export const sortRestaurantsByRating = () =>
    apiCache.getOrFetch("/restaurant/sort/rating", () => api.get("/restaurant/sort/rating"), 30000);

// ===============================
// GET RESTAURANTS BY LOCATION
// GET /restaurant/location/{location}
// ===============================
export const getRestaurantsByLocation = (location) =>
    api.get(`/restaurant/location/${encodeURIComponent(location)}`);

// ===============================
// GET RESTAURANTS BY NAME
// GET /restaurant/name/{name}
// ===============================
export const getRestaurantsByName = (name) =>
    api.get(`/restaurant/name/${encodeURIComponent(name)}`);

// ===============================
// GET MENU ITEMS OF RESTAURANT
// GET /restaurant/{restaurantId}/menu-items
// ===============================
export const getRestaurantMenu = (restaurantId) =>
    apiCache.getOrFetch(
        `/restaurant/${restaurantId}/menu-items`,
        () => api.get(`/restaurant/${restaurantId}/menu-items`),
        30000
    );