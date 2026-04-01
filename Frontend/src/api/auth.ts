import apiClient from './client';

export const login = async (username, password) => {
    const response = await apiClient.post('/users/login/', { username, password });
    if (response.data.token) {
        localStorage.setItem('makemyqr_token', response.data.token);
    }
    return response.data;
};

export const register = async (username, email, password, otp, first_name = '', last_name = '') => {
    const response = await apiClient.post('/users/register/', {
        username, email, password, first_name, last_name, otp
    });
    if (response.data.token) {
        localStorage.setItem('makemyqr_token', response.data.token);
    }
    return response.data;
};

export const sendSignupOTP = async (email: string) => {
    const response = await apiClient.post('/users/send-signup-otp/', { email });
    return response.data;
};

export const updateProfile = async (data: { first_name?: string, last_name?: string, email?: string }) => {
    const response = await apiClient.put('/users/profile/', data);
    return response.data;
};

export const changePassword = async (new_password: string) => {
    const response = await apiClient.post('/users/change-password/', { new_password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('makemyqr_token');
    localStorage.removeItem('makemyqr_user');
};

export const requestPasswordReset = async (email: string) => {
    const response = await apiClient.post('/users/password-reset-request/', { email });
    return response.data;
};

export const requestAdminPasswordReset = async (email: string) => {
    const response = await apiClient.post('/users/admin-password-reset-request/', { email });
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
