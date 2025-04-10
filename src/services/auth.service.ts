import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
}

const authService = {
  async login(data: LoginData) {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.accessToken) {
      Cookies.set('accessToken', response.data.accessToken);
      Cookies.set('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  async logout() {
    const response = await axios.post(`${API_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('accessToken')}`
      }
    });
    Cookies.remove('accessToken');
    Cookies.remove('user');
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData) {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, data);
    return response.data;
  },

  async resetPassword(token: string, data: ResetPasswordData) {
    const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, data);
    return response.data;
  },

  getCurrentUser() {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!Cookies.get('accessToken');
  }
};

export default authService; 