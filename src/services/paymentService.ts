import axiosInstance from '../config/axios';
import { Payment, PaymentRequest } from '../types/payment';

export const paymentService = {
    // Create a new payment
    createPayment: async (paymentData: PaymentRequest) => {
        const response = await axiosInstance.post('/payment/create', paymentData);
        return response.data;
    },

    // Get payment by booking ID
    getPaymentByBooking: async (bookingId: string) => {
        const response = await axiosInstance.get(`/payment/booking/${bookingId}`);
        return response.data;
    },

    // Get payment by user ID
    getPaymentsByUser: async (userId: string) => {
        const response = await axiosInstance.get(`/payment/user/${userId}`);
        return response.data;
    },

    // Update payment status
    updatePaymentStatus: async (paymentId: string, status: string) => {
        const response = await axiosInstance.put(`/payment/${paymentId}/status`, { status });
        return response.data;
    },

    // Get payment by ID
    getPaymentById: async (paymentId: string) => {
        const response = await axiosInstance.get(`/payment/${paymentId}`);
        return response.data;
    }
};
