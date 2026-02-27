import apiClient from './client';

export const login = async (username, password) => {
    const response = await apiClient.post('/users/login/', { username, password });
    if (response.data.token) {
        localStorage.setItem('barqr_token', response.data.token);
    }
    return response.data;
};

export const register = async (username, email, password) => {
    const response = await apiClient.post('/users/register/', { username, email, password });
    if (response.data.token) {
        localStorage.setItem('barqr_token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('barqr_token');
    localStorage.removeItem('barqr_user');
};

export const requestPasswordReset = async (email: string) => {
    const response = await apiClient.post('/users/password-reset-request/', { email });
    return response.data;
};

export const verifyOTP = async (email: string, otp: string) => {
    const response = await apiClient.post('/users/password-reset-verify/', { email, otp });
    return response.data;
};

export const confirmPasswordReset = async (email: string, new_password: string) => {
    const response = await apiClient.post('/users/password-reset-confirm/', { email, new_password });
    return response.data;
};
