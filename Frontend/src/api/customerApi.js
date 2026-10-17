import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const customerApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});


// ===============================
// CREATE CUSTOMER
// POST /customer
// ===============================

export const createCustomer = (customer) => {
    return customerApi.post("/customer", customer);
};


// ===============================
// GET ALL CUSTOMERS
// GET /customer
// ===============================

export const getCustomers = () => {
    return customerApi.get("/customer");
};


// ===============================
// GET CUSTOMER BY ID
// GET /customer/{id}
// ===============================

export const getCustomerById = (id) => {
    return customerApi.get(`/customer/${id}`);
};


// ===============================
// UPDATE CUSTOMER
// PUT /customer/{id}
// ===============================

export const updateCustomer = (id, customer) => {
    return customerApi.put(
        `/customer/${id}`,
        customer
    );
};


// ===============================
// GET CUSTOMER BY CONTACT
// GET /customer/contact/{contact}
// ===============================

export const getCustomerByContact = (contact) => {
    return customerApi.get(
        `/customer/contact/${contact}`
    );
};


// ===============================
// GET CUSTOMER BY EMAIL
// GET /customer/email/{email}
// ===============================

export const getCustomerByEmail = (email) => {
    return customerApi.get(
        `/customer/email/${encodeURIComponent(email)}`
    );
};