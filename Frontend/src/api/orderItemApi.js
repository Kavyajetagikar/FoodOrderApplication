// src/api/orderItemApi.js

import api from "./axios";

export const addItemToExistingOrder = (
    orderId,
    menuId,
    quantity
) =>
    api.post(
        `/order-items/${orderId}/${menuId}/${quantity}`
    );

export const updateOrderItemQuantity = (
    orderItemId,
    quantity
) =>
    api.put(
        `/order-items/${orderItemId}/${quantity}`
    );

export const removeOrderItem = (orderItemId) =>
    api.delete(`/order-items/${orderItemId}`);

export const getOrderItems = (orderId) =>
    api.get(`/order-items/order/${orderId}`);

export const processPayment = (orderId, payment) =>
    api.post(`/order-items/${orderId}`, payment);