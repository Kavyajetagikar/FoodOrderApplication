// src/components/PageLoader.jsx
import React from "react";

export function PageLoader() {
    return (
        <div className="page-loader-wrapper" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: "16px",
            color: "#6b7280"
        }}>
            <div className="loading-spinner" style={{
                width: "42px",
                height: "42px",
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #f97316",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
            }} />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>Loading page...</p>
        </div>
    );
}

export default PageLoader;
