import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// CSRF token
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found');
}

// Helper to refresh CSRF token by fetching the homepage HTML and extracting the meta tag
async function refreshCsrfToken() {
    try {
        // Fetch homepage HTML (returns full page) so server can set a fresh session/csrf token if needed
        const res = await window.axios.get('/', { headers: { Accept: 'text/html' }, transformResponse: [(data) => data] });
        if (typeof window === 'undefined') return null;
        const parser = new DOMParser();
        const doc = parser.parseFromString(res.data, 'text/html');
        const newToken = doc.querySelector('meta[name="csrf-token"]');
        if (newToken && newToken.content) {
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken.content;
            // Update the page's meta tag too if present
            const existing = document.head.querySelector('meta[name="csrf-token"]');
            if (existing) existing.content = newToken.content;
            return newToken.content;
        }
    } catch (e) {
        console.error('Failed to refresh CSRF token', e);
    }
    return null;
}

// Retry once on 419 (CSRF) errors by refreshing token and retrying the original request
window.axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;
        const originalRequest = error?.config;

        if ((status === 419 || status === 401) && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            await refreshCsrfToken();
            try {
                return await window.axios(originalRequest);
            } catch (e) {
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);
