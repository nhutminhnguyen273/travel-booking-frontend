import axiosInstance from '../config/axios';
import { Login, Register, AuthResponse } from '../types/auth';
import Cookies from 'js-cookie';

// Create an event emitter for auth state changes
const authStateChangeCallbacks: (() => void)[] = [];

const authService = {
    onAuthStateChange: (callback: () => void) => {
        authStateChangeCallbacks.push(callback);
        return () => {
            const index = authStateChangeCallbacks.indexOf(callback);
            if (index > -1) {
                authStateChangeCallbacks.splice(index, 1);
            }
        };
    },

    notifyAuthStateChange: () => {
        authStateChangeCallbacks.forEach(callback => callback());
    },

    login: async (credentials: Login): Promise<AuthResponse> => {
        try {
            console.log('Attempting login with credentials:', credentials);
            const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
            console.log('Login response:', response.data);
            
            if (response.data.accessToken) {
                // Lưu token vào cookie với thời hạn 1 giờ
                Cookies.set('token', response.data.accessToken, { 
                    expires: 1/24, // 1 hour (1/24 of a day)
                    secure: true,
                    sameSite: 'strict'
                });
                // Lưu thông tin user vào cookie
                Cookies.set('user', JSON.stringify(response.data.user), {
                    expires: 1/24, // 1 hour
                    secure: true,
                    sameSite: 'strict'
                });
                console.log('Token and user data stored in cookies');
                // Notify auth state change
                authService.notifyAuthStateChange();
            }
            return response.data;
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    },

    register: async (userData: Register): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    },

    logout: (): void => {
        console.log('Logging out...');
        // Xóa tất cả cookies liên quan đến authentication
        Cookies.remove('token', { path: '/', domain: window.location.hostname });
        Cookies.remove('user', { path: '/', domain: window.location.hostname });
        
        // Xóa tất cả cookies khác
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach(cookieName => {
            // Xóa cookie với tất cả các domain và path có thể
            Cookies.remove(cookieName, { path: '/', domain: window.location.hostname });
            Cookies.remove(cookieName, { path: '/' });
            Cookies.remove(cookieName);
        });

        // Xóa tất cả cookies trong localStorage và sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        console.log('All cookies and storage cleared');
        // Notify auth state change
        authService.notifyAuthStateChange();
    },

    isAuthenticated: (): boolean => {
        const token = Cookies.get('token');
        const user = Cookies.get('user');
        return !!(token && user);
    },

    getToken: (): string | null => {
        return Cookies.get('token') || null;
    },

    getUser: (): any => {
        const userStr = Cookies.get('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user from cookies:', error);
            return null;
        }
    },

    getUserFromToken: (): any => {
        const token = Cookies.get('token');
        if (!token) return null;

        try {
            // JWT token có 3 phần, phần payload là phần thứ 2
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    checkAuthAndGetUser: (): { success: boolean; user: any; message: string } => {
        const token = Cookies.get('token');
        const userStr = Cookies.get('user');

        if (!token || !userStr) {
            return {
                success: false,
                user: null,
                message: "Vui lòng đăng nhập để thực hiện"
            };
        }

        try {
            const user = JSON.parse(userStr);
            return {
                success: true,
                user: user,
                message: ""
            };
        } catch (error) {
            console.error('Error parsing user data:', error);
            return {
                success: false,
                user: null,
                message: "Vui lòng đăng nhập để thực hiện"
            };
        }
    },

    forgotPassword: async (email: string): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post<AuthResponse>('/auth/forgot-password', { email });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Không thể gửi email khôi phục mật khẩu');
        }
    },

    resetPassword: async (token: string, data: { newPassword: string }): Promise<AuthResponse> => {
        try {
            console.log('Sending reset password request with token:', token);
            const response = await axiosInstance.post<AuthResponse>(`/auth/reset-password/${token}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Reset password error details:', error);
            if (error.response) {
                // Server responded with error
                throw new Error(error.response.data?.message || 'Không thể đặt lại mật khẩu');
            } else if (error.request) {
                // Request was made but no response received
                throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
            } else {
                // Something happened in setting up the request
                throw new Error('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.');
            }
        }
    }
};

export default authService;
