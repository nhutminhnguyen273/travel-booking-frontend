import axiosInstance from '../config/axios';
import { Login, Register, AuthResponse } from '../types/auth';
import Cookies from 'js-cookie';

const authService = {
    login: async (credentials: Login): Promise<AuthResponse> => {
        try {
            console.log('Attempting login with credentials:', credentials);
            const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
            console.log('Login response:', response.data);
            
            if (response.data.accessToken) {
                // Lưu token vào cookie
                Cookies.set('token', response.data.accessToken, { 
                    expires: 7, // 7 days
                    secure: true,
                    sameSite: 'strict'
                });
                // Lưu thông tin user vào cookie
                Cookies.set('user', JSON.stringify(response.data.user), {
                    expires: 7,
                    secure: true,
                    sameSite: 'strict'
                });
                console.log('Token and user data stored in cookies');
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
        console.log('Logging out - clearing cookies');
        Cookies.remove('token');
        Cookies.remove('user');
    },

    isAuthenticated: (): boolean => {
        const token = Cookies.get('token');
        const user = Cookies.get('user');
        
        console.log('Authentication check:', {
            hasToken: !!token,
            hasUser: !!user,
            token: token ? 'Token exists' : 'No token',
            user: user ? 'User exists' : 'No user'
        });

        if (!token || !user) {
            console.log('Authentication failed: Missing token or user data');
            return false;
        }

        try {
            const userData = JSON.parse(user);
            console.log('User data from cookies:', {
                id: userData._id,
                email: userData.email,
                role: userData.role
            });
            return true;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return false;
        }
    },

    getToken: (): string | null => {
        const token = Cookies.get('token');
        console.log('Getting token from cookies:', token ? 'Token exists' : 'No token');
        return token || null;
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

    getUser: (): any => {
        const userStr = Cookies.get('user');
        console.log('Getting user from cookies:', userStr ? 'User exists' : 'No user');
        
        if (!userStr) {
            console.log('No user data found in cookies');
            return null;
        }

        try {
            const user = JSON.parse(userStr);
            console.log('User data retrieved:', {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            });
            return user;
        } catch (error) {
            console.error('Error parsing user from cookies:', error);
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

    resetPassword: async (token: string, data: { newPassword: string; confirmPassword: string }): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post<AuthResponse>(`/auth/reset-password/${token}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
        }
    }
};

export default authService;
