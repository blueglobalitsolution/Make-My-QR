import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Add interceptor to include token in headers
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('makemyqr_token');
    if (token) {
        // Use set() for better compatibility with different axios versions
        config.headers.set('Authorization', `Token ${token}`);
    }
    return config;
});

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized request - logging out");
            localStorage.removeItem('makemyqr_token');
            localStorage.removeItem('makemyqr_user');
            // Force a reload or redirect if necessary, or let the app state handle it
        }
        return Promise.reject(error);
    }
);

export default apiClient;
