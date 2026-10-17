// src/utils/imageUtils.js

/**
 * Optimizes an image URL by applying dimensions and format constraints
 * (Works seamlessly with Unsplash images or returns default URL).
 *
 * @param {string} url - Original image URL
 * @param {number} width - Target width in pixels (e.g. 200, 400, 600)
 * @param {number} quality - Quality percentage (default 80)
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(url, width = 400, quality = 80) {
    if (!url || typeof url !== "string") {
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
    }

    // Optimize Unsplash images
    if (url.includes("images.unsplash.com")) {
        try {
            const urlObj = new URL(url);
            urlObj.searchParams.set("w", String(width));
            urlObj.searchParams.set("auto", "format");
            urlObj.searchParams.set("fit", "crop");
            urlObj.searchParams.set("q", String(quality));
            return urlObj.toString();
        } catch {
            return url;
        }
    }

    return url;
}
