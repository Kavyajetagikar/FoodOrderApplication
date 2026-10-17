// src/api/orderApi.js

import api from "./axios";

export const placeOrder = (customerId, order) =>
    api.post(`/orders/${customerId}`, order);

export const getAllOrders = () =>
    api.get("/orders");

export const getOrderById = (id) =>
    api.get(`/orders/${id}`);

export const getCustomerOrders = (customerId) =>
    api.get(`/orders/customer/${customerId}`);

export const updateOrderStatus = (orderId, status) =>
    api.put(`/orders/${orderId}/status/${status}`);

export const cancelOrder = (orderId) =>
    api.put(`/orders/${orderId}/cancel`);

export const getOrdersByStatus = (status) =>
    api.get(`/orders/status/${status}`);

export const getOrdersByDate = (date) =>
    api.get(`/orders/date/${date}`);

export const getOrdersByRestaurant = (resId) =>
    api.get(`/orders/restaurant/${resId}`);

export const getOrdersByPrice = (min, max) =>
    api.get(`/orders/price/${min}/${max}`);