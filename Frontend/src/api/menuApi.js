// src/api/menuApi.js
import api from "./axios";
import apiCache from "./cache";

export const addMenuItem = async (restaurantId, item) => {
    const res = await api.post(`/menu-items/${restaurantId}`, item);
    apiCache.invalidate(`/restaurant/${restaurantId}/menu-items`);
    apiCache.invalidate("/menu-items");
    return res;
};

export const getAllMenuItems = () =>
    apiCache.getOrFetch("/menu-items", () => api.get("/menu-items"), 30000);

export const updateMenuPrice = async (id, price) => {
    const res = await api.put(`/menu-items/${id}/price/${price}`);
    apiCache.invalidate("/restaurant");
    apiCache.invalidate("/menu-items");
    return res;
};

export const updateAvailability = async (id, availability) => {
    const res = await api.put(`/menu-items/${id}/availability/${availability}`);
    apiCache.invalidate("/restaurant");
    apiCache.invalidate("/menu-items");
    return res;
};

export const deleteMenuItem = async (id) => {
    const res = await api.delete(`/menu-items/${id}`);
    apiCache.invalidate("/restaurant");
    apiCache.invalidate("/menu-items");
    return res;
};

export const getItemsByPrice = (price) =>
    apiCache.getOrFetch(`/menu-items/price/${price}`, () => api.get(`/menu-items/price/${price}`), 30000);

export const getItemsByName = (name) =>
    apiCache.getOrFetch(
        `/menu-items/name/${encodeURIComponent(name)}`,
        () => api.get(`/menu-items/name/${encodeURIComponent(name)}`),
        30000
    );