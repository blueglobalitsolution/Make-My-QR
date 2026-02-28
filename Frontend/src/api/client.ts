import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Add interceptor to include token in headers
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('barqr_token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default apiClient;
