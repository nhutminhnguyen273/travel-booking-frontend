import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import env from "./env";
import Cookies from 'js-cookie';

const API_BASE_URL = env.apiBaseUrl;

// Tạo instance của Axios
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true, // Enable sending cookies with requests
    headers: {
        'Content-Type': "application/json",
        'Accept': 'application/json'
    }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Thêm token vào header nếu có
        const token = Cookies.get('token');
        console.log('Current token:', token); // Debug log
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request headers:', config.headers); // Debug log
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log('Response:', response); // Debug log
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: error.config
        });

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            // Clear authentication cookies
            Cookies.remove('token');
            Cookies.remove('user');
            // You might want to redirect to login page here
            window.location.href = '/login';
        }

        // Handle CORS errors
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.error('CORS Error:', 'Please check backend CORS configuration');
            // You might want to show a user-friendly error message here
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;