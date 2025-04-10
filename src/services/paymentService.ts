import axiosInstance from '../config/axios';
import { Payment } from '../types/payment';

export const paymentService = {
    // Create a new payment
    createPayment: async (paymentData: Omit<Payment, 'paidAt'>) => {
        const response = await axiosInstance.post('/payments', paymentData);
        return response.data;
    },

    // Get payment by booking ID
    getPaymentByBooking: async (bookingId: string) => {
        const response = await axiosInstance.get(`/payments/booking/${bookingId}`);
        return response.data;
    },

    // Get payment by user ID
    getPaymentsByUser: async (userId: string) => {
        const response = await axiosInstance.get(`/payments/user/${userId}`);
        return response.data;
    },

    // Update payment status
    updatePaymentStatus: async (paymentId: string, status: string) => {
        const response = await axiosInstance.put(`/payments/${paymentId}/status`, { status });
        return response.data;
    },

    // Get payment by ID
    getPaymentById: async (paymentId: string) => {
        const response = await axiosInstance.get(`/payments/${paymentId}`);
        return response.data;
    }
};
