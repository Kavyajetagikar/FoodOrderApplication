// src/api/cache.js

/**
 * In-memory API response cache with TTL and request deduplication.
 */
class ApiCache {
    constructor(defaultTtlMs = 60000) { // 1 minute default TTL
        this.cache = new Map();
        this.inFlight = new Map();
        this.defaultTtlMs = defaultTtlMs;
    }

    /**
     * Fetch with caching and in-flight deduplication
     * @param {string} key - Unique cache key (e.g. endpoint URL)
     * @param {Function} fetcher - Async function returning the promise
     * @param {number} ttlMs - Optional custom TTL
     * @returns {Promise<any>}
     */
    async getOrFetch(key, fetcher, ttlMs = this.defaultTtlMs) {
        const now = Date.now();
        const cached = this.cache.get(key);

        if (cached && cached.expiry > now) {
            return cached.data;
        }

        // If identical request is already in-flight, return the same promise
        if (this.inFlight.has(key)) {
            return this.inFlight.get(key);
        }

        const promise = fetcher()
            .then((res) => {
                this.cache.set(key, {
                    data: res,
                    expiry: Date.now() + ttlMs
                });
                this.inFlight.delete(key);
                return res;
            })
            .catch((err) => {
                this.inFlight.delete(key);
                throw err;
            });

        this.inFlight.set(key, promise);
        return promise;
    }

    /**
     * Invalidate specific key or keys matching prefix
     * @param {string} prefixOrKey - Exact key or prefix to invalidate
     */
    invalidate(prefixOrKey) {
        if (!prefixOrKey) {
            this.cache.clear();
            return;
        }

        for (const key of this.cache.keys()) {
            if (key.startsWith(prefixOrKey)) {
                this.cache.delete(key);
            }
        }
    }
}

export const apiCache = new ApiCache();
export default apiCache;
