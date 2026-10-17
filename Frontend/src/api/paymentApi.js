// src/api/paymentApi.js

import api from "./axios";

export const getPaymentById = (paymentId) =>
    api.get(`/payments/${paymentId}`);

export const getPaymentsByStatus = (status) =>
    api.get(`/payments/status/${status}`);

export const getPaymentsByMethod = (method) =>
    api.get(`/payments/method/${method}`);

export const updatePaymentStatus = (
    paymentId,
    status
) =>
    api.put(
        `/payments/${paymentId}/status/${status}`
    );