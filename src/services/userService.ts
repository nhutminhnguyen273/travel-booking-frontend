import axiosInstance from '../config/axios';
import { User } from '../types/user';

const userService = {
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get('/users');
            // Access the data array from the response
            return Array.isArray(response.data.data) ? response.data.data : [];
        } catch (error: any) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    getUserById: async (id: string) => {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    },
    
    createUser: async (credentials: User): Promise<User> => {
        try {
            const response = await axiosInstance.post<User>('/users/', credentials);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Thêm người dùng thất bại");
        }
    },

    updateUser: async (id: string, userData: User): Promise<User> => {
        try {
            const response = await axiosInstance.put<User>(`/users/${id}`, userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Cập nhật người dùng thất bại");
        }
    },
    deleteUser: async (id: string) => {
        const response = await axiosInstance.delete(`/users/${id}`);
        return response.data;
    }
}

export default userService;
