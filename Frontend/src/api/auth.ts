import apiClient from './client';
import { mapUserData } from './mappers';

export const login = async (username, password) => {
    const response = await apiClient.post('/users/login/', { username, password });
    if (response.data.token) {
        localStorage.setItem('makemyqr_token', response.data.token);
        localStorage.setItem('makemyqr_login_time', Date.now().toString());

        // Centrally store user data if provided
        if (response.data.user) {
            const mappedUser = mapUserData(response.data);
            localStorage.setItem('makemyqr_user', JSON.stringify(mappedUser));
        }
    }
    return response.data;
};

export const register = async (username, email, password, otp, first_name = '', last_name = '') => {
    const response = await apiClient.post('/users/register/', {
        username, email, password, first_name, last_name, otp
    });
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
    localStorage.removeItem('makemyqr_login_time');
    localStorage.removeItem('makemyqr_view_data');
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

export const refreshToken = async () => {
    const response = await apiClient.post('/users/refresh-token/');
    if (response.data.token) {
        localStorage.setItem('makemyqr_token', response.data.token);
        localStorage.setItem('makemyqr_login_time', Date.now().toString());
    }
    return response.data;
};
