// src/components/Toast.jsx
import React, { useState, useEffect } from "react";

// Global event bus for showing toasts anywhere in the app
let toastHandler = null;

export const showToast = (message, type = "success", duration = 3000) => {
    if (toastHandler) {
        toastHandler(message, type, duration);
    }
};

export function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        toastHandler = (message, type, duration) => {
            const id = Date.now() + Math.random();
            setToasts((prev) => [...prev, { id, message, type }]);

            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        };

        return () => {
            toastHandler = null;
        };
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast-message toast-${toast.type}`}>
                    <span className="toast-icon">
                        {toast.type === "success" && "✅"}
                        {toast.type === "error" && "❌"}
                        {toast.type === "info" && "ℹ️"}
                        {toast.type === "warning" && "⚠️"}
                    </span>
                    <span className="toast-text">{toast.message}</span>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ToastContainer;
